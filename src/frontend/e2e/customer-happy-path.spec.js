import { expect, test } from "@playwright/test";

const API_BASE_URL = "http://localhost:5000/api";

function formatVnd(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function logValidationResponses(page) {
  page.on("response", async (response) => {
    if (response.status() !== 422) return;

    let body;
    try {
      body = await response.json();
    } catch {
      body = { message: "Phan hoi 422 khong phai JSON" };
    }

    console.error(
      `[422 Validation] ${response.request().method()} ${response.url()}\n` +
      JSON.stringify(body, null, 2),
    );
  });

  page.on("requestfailed", (request) => {
    if (!request.url().includes("/api/")) return;
    console.error(
      `[API Network Error] ${request.method()} ${request.url()} - ${request.failure()?.errorText || "Khong ro loi mang"}`,
    );
  });

  page.on("response", async (response) => {
    const status = response.status();
    if (!response.url().includes("/api/") || status < 400) return;

    let body;
    try {
      body = await response.json();
    } catch {
      body = { message: "Phan hoi loi khong phai JSON" };
    }
    console.error(
      `[API HTTP ${status}] ${response.request().method()} ${response.url()}\n` +
      JSON.stringify(body, null, 2),
    );
  });
}

async function readJson(response) {
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`API ${response.request().method()} ${response.url()} tra ve HTTP ${response.status()} ma khong phai JSON.`);
  }
  if (response.status() === 422 || !body.success || !response.ok()) {
    console.error(
      `[API Validation] ${response.request().method()} ${response.url()} - HTTP ${response.status()}\n` +
      JSON.stringify(body, null, 2),
    );
  }
  expect(
    body.success,
    `API ${response.request().method()} ${response.url()} tra ve that bai: ${body.message || "Khong co message"}`,
  ).toBe(true);
  return body;
}

async function clearCustomerCart(page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const csrfToken = await page.evaluate(() => {
    const entry = document.cookie
      .split("; ")
      .find((item) => item.startsWith("csrf_token="));
    return entry ? decodeURIComponent(entry.slice("csrf_token=".length)) : "";
  });

  if (csrfToken) {
    const response = await page.request.delete(`${API_BASE_URL}/cart`, {
      headers: {
        origin: "http://localhost:5173",
        "x-csrf-token": csrfToken,
      },
    });
    expect([200]).toContain(response.status());
  }

  await page.reload();
  await page.waitForLoadState("networkidle");
}

test("Khach mua san pham, dat hang va tra cuu don hang", async ({ page }) => {
  await clearCustomerCart(page);
  logValidationResponses(page);

  const bannersPromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/banners") &&
      response.request().method() === "GET",
  );
  const categoriesPromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/categories") &&
      response.request().method() === "GET",
  );
  const productsPromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/products") &&
      response.request().method() === "GET",
  );

  await page.goto("/");

  const bannersResponse = await bannersPromise;
  const categoriesResponse = await categoriesPromise;
  const productsResponse = await productsPromise;

  const bannersBody = await readJson(bannersResponse);
  const categoriesBody = await readJson(categoriesResponse);
  const productsBody = await readJson(productsResponse);

  const banners = bannersBody.data.items || [];
  const categories = categoriesBody.data.items || [];
  const products = productsBody.data.items || [];

  expect(categories.length, "Can co it nhat mot danh muc dang Active").toBeGreaterThan(0);
  expect(products.length, "Can co it nhat mot san pham dang Active va trong danh muc Active").toBeGreaterThan(0);

  if (banners.length > 0) {
    await expect(
      page.getByText(banners[0].title, { exact: true }).first(),
    ).toBeVisible();
  }

  for (const category of categories.slice(0, 4)) {
    await expect(page.getByText(category.name, { exact: true }).first()).toBeVisible();
  }

  for (const product of products.slice(0, 4)) {
    await expect(
      page.getByRole("heading", { name: product.name, level: 3 }).first(),
    ).toBeVisible();
  }

  let addedProduct = null;
  let addResponse = null;

  for (const product of products) {
    await page.goto(`/products/${product.slug}`);
    await page.waitForLoadState("domcontentloaded");

    const productHeading = page.getByRole("heading", {
      name: product.name,
      level: 1,
    });
    await expect(productHeading).toBeVisible();

    const addButton = page.getByRole("button", {
      name: "Thêm vào giỏ hàng",
      exact: true,
    });
    await expect(addButton).toBeVisible();
    await expect(addButton).toBeEnabled();
    await addButton.scrollIntoViewIfNeeded();

    const addResponsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/cart/items") &&
        response.request().method() === "POST",
    );
    await addButton.click();
    addResponse = await addResponsePromise;

    if (addResponse.status() === 200) {
      addedProduct = product;
      break;
    }
  }

  expect(addedProduct, "Khong tim thay san pham con du ton kho de them vao gio").not.toBeNull();

  const addBody = await readJson(addResponse);
  const cartDataAfterAdd = addBody.data;
  await expect(
    page.getByRole("link", {
      name: new RegExp(`^Giỏ hàng, ${cartDataAfterAdd.itemCount} sản phẩm$`),
    }),
  ).toBeVisible();

  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Giỏ hàng", level: 1 })).toBeVisible();

  const cartRow = page
    .locator("article")
    .filter({ hasText: addedProduct.name })
    .first();
  await expect(cartRow).toBeVisible();

  const visibleQuantity = cartRow.locator("span.min-w-8:visible");
  await expect(visibleQuantity).toHaveText("1");

  const updateResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes(`/api/cart/items/${addedProduct._id}`) &&
      response.request().method() === "PUT",
  );
  const increaseButton = cartRow.getByRole("button", { name: "Tăng số lượng" });
  await increaseButton.scrollIntoViewIfNeeded();
  await increaseButton.click();
  const updateResponse = await updateResponsePromise;
  expect(updateResponse.status()).toBe(200);

  const updateBody = await readJson(updateResponse);
  const updatedItem = updateBody.data.items.find(
    (item) => item.productId === addedProduct._id,
  );
  expect(updatedItem.quantity).toBe(2);
  await expect(visibleQuantity).toHaveText("2");

  const visibleCartSubtotal = page
    .locator("aside")
    .locator(".text-xl.font-black.text-orange-700:visible")
    .first();
  await expect(visibleCartSubtotal).toHaveText(formatVnd(updateBody.data.subtotal));

  const checkoutLink = page.getByRole("link", { name: "Tiến hành đặt hàng", exact: true });
  await checkoutLink.scrollIntoViewIfNeeded();
  await checkoutLink.click();
  await expect(
    page.getByRole("heading", { name: "Thông tin nhận hàng", level: 1 }),
  ).toBeVisible();

  const fullNameInput = page.getByLabel(/Họ và tên/);
  const phoneInput = page.getByLabel(/Số điện thoại/);
  const addressInput = page.getByLabel(/Địa chỉ nhận hàng/);
  const noteInput = page.getByLabel(/Ghi chú/);

  await fullNameInput.scrollIntoViewIfNeeded();
  await fullNameInput.fill("Playwright Khach Test");
  await phoneInput.scrollIntoViewIfNeeded();
  await phoneInput.fill("0987654321");
  await addressInput.scrollIntoViewIfNeeded();
  await addressInput.fill("123 Playwright Street, Thanh Pho Ho Chi Minh");
  await noteInput.scrollIntoViewIfNeeded();
  await noteInput.fill("Giao gio hanh chinh");

  await expect(fullNameInput).toHaveValue("Playwright Khach Test");
  await expect(phoneInput).toHaveValue("0987654321");
  await expect(addressInput).toHaveValue("123 Playwright Street, Thanh Pho Ho Chi Minh");
  await expect(noteInput).toHaveValue("Giao gio hanh chinh");

  const orderResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/orders") &&
      response.request().method() === "POST",
  );
  const submitOrderButton = page.getByRole("button", {
    name: "Xác nhận đặt hàng",
    exact: true,
  });
  await submitOrderButton.scrollIntoViewIfNeeded();
  await submitOrderButton.click();
  const orderResponse = await orderResponsePromise;
  expect([200, 201]).toContain(orderResponse.status());

  const orderBody = await readJson(orderResponse);
  const orderCode = orderBody.data.order.orderCode;
  const trackCode = orderBody.data.trackCode;

  expect(orderCode).toBeTruthy();
  expect(trackCode).toBeTruthy();
  await expect(page).toHaveURL(/\/order-success$/);
  await expect(page.getByText("Đặt hàng thành công", { exact: true })).toBeVisible();
  await expect(page.getByText(orderCode, { exact: true }).first()).toBeVisible();
  await expect(page.getByText(trackCode, { exact: true }).first()).toBeVisible();

  await page.goto("/track-order");
  await expect(
    page.getByRole("heading", { name: "Tra cứu đơn hàng", level: 1 }),
  ).toBeVisible();

  const orderCodeInput = page.getByLabel(/Mã đơn hàng/);
  const trackCodeInput = page.getByLabel(/Mã tra cứu/);
  await orderCodeInput.scrollIntoViewIfNeeded();
  await orderCodeInput.fill(orderCode);
  await trackCodeInput.scrollIntoViewIfNeeded();
  await trackCodeInput.fill(trackCode);

  await expect(orderCodeInput).toHaveValue(orderCode);
  await expect(trackCodeInput).toHaveValue(trackCode);

  let trackResponse = null;
  const trackResponseListener = (response) => {
    if (
      response.url().endsWith("/api/orders/track") &&
      response.request().method() === "POST"
    ) {
      trackResponse = response;
    }
  };
  page.on("response", trackResponseListener);

  const trackButton = page.getByRole("button", { name: "Tra cứu", exact: true });
  await trackButton.scrollIntoViewIfNeeded();
  await trackButton.click();

  await expect(
    page.getByRole("heading", { name: orderCode, level: 2 }),
  ).toBeVisible({ timeout: 15_000 });

  expect(trackResponse, "Khong ghi nhan HTTP response tu API /api/orders/track").not.toBeNull();
  expect(trackResponse.status()).toBe(200);
  page.off("response", trackResponseListener);

  const trackBody = await readJson(trackResponse);
  const trackedOrder = trackBody.data.order;
  expect(trackedOrder.orderCode).toBe(orderCode);
  expect(trackedOrder.status).toBe("PENDING");
  expect(trackedOrder.customerInfo.phone).toMatch(/^\d{4}\*\*\*\d{3}$/);
  expect(trackedOrder.customerInfo.address).toBe("123 Playwright Street, Thanh Pho Ho Chi Minh");
  await expect(page.getByText("Chờ xử lý", { exact: true }).first()).toBeVisible();
});
