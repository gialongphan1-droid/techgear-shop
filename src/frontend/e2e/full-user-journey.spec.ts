import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const testEmail = process.env.E2E_USER_EMAIL;
const testPassword = process.env.E2E_USER_PASSWORD;
const screenshotDirectory = fileURLToPath(new URL("./screenshots/", import.meta.url));

async function openMobileMenuWhenNeeded(page: import("@playwright/test").Page) {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 1024) {
    await page.getByRole("button", { name: "Mở menu" }).click();
  }
}

test("customer completes a purchase and sees it in My Orders", async ({ page }) => {
  test.skip(
    !testEmail || !testPassword,
    "Set E2E_USER_EMAIL and E2E_USER_PASSWORD to the verified test account credentials.",
  );

  await page.goto("/", { waitUntil: "networkidle" });
  await openMobileMenuWhenNeeded(page);
  await expect(page.getByRole("link", { name: "Đăng nhập" })).toBeVisible();
  await page.getByRole("link", { name: "Đăng nhập" }).click();

  await expect(page.getByRole("heading", { name: "Đăng nhập", level: 1 })).toBeVisible();
  await page.getByRole("textbox", { name: "Email" }).fill(testEmail!);
  await page.getByRole("textbox", { name: "Mật khẩu" }).fill(testPassword!);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.waitForLoadState("networkidle");
  await page.goto("http://localhost:5173/products");
  await page.waitForLoadState("networkidle");

  await page.goto("/cart");
  const deleteButtons = page
    .getByRole("button", { name: /^Xóa .* khỏi giỏ hàng$/ })
    .filter({ visible: true });

  while (await deleteButtons.count()) {
    const remainingItems = await deleteButtons.count();
    await deleteButtons.first().click();
    await expect(deleteButtons).toHaveCount(remainingItems - 1);
  }
  await expect(page.getByRole("heading", { name: "Giỏ hàng đang trống", level: 1 })).toBeVisible();

  const cartLink = page.getByRole("link", { name: /^Giỏ hàng,/ });
  const visibleCartLink = cartLink.filter({ visible: true });
  await expect(visibleCartLink).toHaveAttribute("aria-label", "Giỏ hàng, 0 sản phẩm");

  await page.goto("http://localhost:5173/products");
  await page.waitForLoadState("networkidle");

  const firstProductLink = page.locator('a[href*="/products/"]').first();
  if (await firstProductLink.count() === 0) {
    await mkdir(screenshotDirectory, { recursive: true });
    await page.screenshot({
      path: resolve(screenshotDirectory, "debug-products-page.png"),
      fullPage: true,
    });
  }
  await expect(firstProductLink).toBeVisible();
  await firstProductLink.click();

  const productHeading = page.getByRole("heading", { level: 1 });
  await expect(productHeading).toBeVisible();
  const productName = (await productHeading.innerText()).trim();
  await expect(page.getByText("Còn hàng", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /^Thêm vào giỏ/ }).click();

  await expect(page.getByRole("status").filter({ hasText: `${productName} đã được thêm vào giỏ hàng` })).toBeVisible();
  await expect(visibleCartLink).toHaveAttribute("aria-label", "Giỏ hàng, 1 sản phẩm");
  await visibleCartLink.click();

  await expect(page.getByRole("heading", { name: "Giỏ hàng", level: 1 })).toBeVisible();
  const cartRow = page.locator("article").filter({ hasText: productName }).first();
  await expect(cartRow).toBeVisible();
  const visibleCartQuantity = cartRow
    .locator('[aria-label^="Số lượng"]')
    .filter({ visible: true });
  await expect(visibleCartQuantity).toContainText("1");

  const quantityResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/api/cart/items/") &&
      response.request().method() === "PUT",
  );
  await cartRow.getByRole("button", { name: "Tăng số lượng" }).click();
  expect((await quantityResponse).status()).toBe(200);
  await expect(visibleCartQuantity).toContainText("2");

  const noteInput = cartRow.getByLabel("Ghi chú cho sản phẩm");
  const noteResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/api/cart/items/") &&
      response.request().method() === "PUT",
  );
  await noteInput.fill("Giao hàng giờ hành chính");
  await noteInput.press("Tab");
  expect((await noteResponse).status()).toBe(200);

  await page.getByRole("link", { name: "Tiến hành đặt hàng", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Thông tin nhận hàng", level: 1 })).toBeVisible();
  await page.getByLabel(/Họ và tên/).fill("Gia Long Test");
  await page.getByLabel(/Số điện thoại/).fill("0901234567");
  await page.getByLabel(/Địa chỉ nhận hàng/).fill("123 Đường ABC, Quận 1, TP.HCM");

  const orderResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/orders") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Xác nhận đặt hàng", exact: true }).click();
  const orderResponse = await orderResponsePromise;
  expect([200, 201]).toContain(orderResponse.status());

  const orderResult = await orderResponse.json();
  expect(orderResult.success).toBe(true);
  const orderCode = orderResult.data.order.orderCode as string;
  const trackCode = orderResult.data.trackCode as string;
  expect(orderCode).toBeTruthy();
  expect(trackCode).toBeTruthy();
  const orderedItem = orderResult.data.order.items.find(
    (item: { name: string }) => item.name === productName,
  );
  expect(orderedItem?.quantity).toBe(2);
  expect(orderedItem?.note).toBe("Giao hàng giờ hành chính");

  await expect(page).toHaveURL(/\/order-success$/);
  await expect(page.getByText("Đặt hàng thành công", { exact: true })).toBeVisible();
  await expect(page.getByText(orderCode, { exact: true }).first()).toBeVisible();
  await expect(page.getByText(trackCode, { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/chờ xử lý/i).first()).toBeVisible();

  await mkdir(screenshotDirectory, { recursive: true });
  await page.screenshot({
    path: resolve(screenshotDirectory, "full-user-journey-order-success.png"),
    fullPage: true,
    mask: [page.getByText(trackCode, { exact: true })],
  });

  await openMobileMenuWhenNeeded(page);
  await page.getByRole("button", { name: "Tài khoản" }).click();
  await page.getByRole("link", { name: "Tra cứu đơn hàng", exact: true }).click();
  await expect(page).toHaveURL(/\/track-order$/);
  await expect(page.getByRole("heading", { name: "Tra cứu đơn hàng", level: 1 })).toBeVisible();
  await page.waitForLoadState("networkidle");

  await page.getByLabel("Mã đơn hàng").fill(orderCode);
  await page.getByLabel("Mã tra cứu").fill(trackCode);
  const trackingResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/orders/track") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Tra cứu", exact: true }).click();
  const trackingResponse = await trackingResponsePromise;
  expect(trackingResponse.status()).toBe(200);
  const trackingResult = await trackingResponse.json();
  expect(trackingResult.success).toBe(true);
  expect(trackingResult.data.order.orderCode).toBe(orderCode);
  expect(trackingResult.data.order.status).toBe("PENDING");
  await expect(page.getByRole("heading", { name: orderCode, level: 2 })).toBeVisible();
  await expect(page.getByText("Chờ xử lý", { exact: true })).toBeVisible();
  await expect(page.getByText(`${productName} × 2`, { exact: true })).toBeVisible();
  await page.screenshot({
    path: resolve(screenshotDirectory, "full-user-journey-order-tracking.png"),
    fullPage: true,
  });

  await openMobileMenuWhenNeeded(page);
  await page.getByRole("button", { name: "Tài khoản" }).click();
  await page.getByRole("link", { name: "Đơn hàng của tôi", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Đơn hàng của tôi", level: 1 })).toBeVisible();

  const placedOrder = page.locator("article").filter({ hasText: orderCode });
  await expect(placedOrder).toBeVisible();
  await expect(placedOrder.getByText("Chờ xử lý", { exact: true })).toBeVisible();
  await page.screenshot({
    path: resolve(screenshotDirectory, "full-user-journey-my-orders.png"),
    fullPage: true,
  });
});
