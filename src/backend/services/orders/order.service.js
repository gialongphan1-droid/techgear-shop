import crypto from "crypto";
import mongoose from "mongoose";
import Cart from "../../models/Cart.js";
import Category from "../../models/Category.js";
import InventoryLog from "../../models/InventoryLog.js";
import Order from "../../models/Order.js";
import OrderHistory from "../../models/OrderHistory.js";
import Product from "../../models/Product.js";

const MAX_CART_ITEMS = 20;
const MAX_QUANTITY_PER_ITEM = 10;

function serviceError(status, message, errors = [], data = {}) {
  const error = new Error(message);
  error.status = status;
  error.errors = errors;
  error.data = data;
  return error;
}

function hashText(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

async function findCheckoutCart(req, session) {
  let query = Cart.findOne({
    userId: req.user.id,
    status: "ACTIVE",
    expireAt: { $gt: new Date() },
  }).select("userId items status expireAt");
  if (session) query = query.session(session);

  const cart = await query;
  if (!cart || cart.items.length === 0) {
    throw serviceError(422, "Giỏ hàng trống", [], {});
  }
  return cart;
}

function normalizeCustomerInfo(customerInfo) {
  if (!customerInfo || typeof customerInfo !== "object" || Array.isArray(customerInfo)) {
    throw serviceError(422, "Thông tin khách hàng không hợp lệ", [], {});
  }

  const allowed = new Set(["fullName", "phone", "address", "note"]);
  if (Object.keys(customerInfo).some((key) => !allowed.has(key))) {
    throw serviceError(422, "Thông tin khách hàng không hợp lệ", [{ field: "customerInfo", message: "Chứa trường không được phép" }], {});
  }

  const errors = [];
  const fullName = typeof customerInfo.fullName === "string" ? customerInfo.fullName.trim() : "";
  const phone = typeof customerInfo.phone === "string" ? customerInfo.phone.trim() : "";
  const address = typeof customerInfo.address === "string" ? customerInfo.address.trim() : "";
  const note = typeof customerInfo.note === "string" ? customerInfo.note.trim() : "";

  if (fullName.length < 2 || fullName.length > 100 || /[<>]/.test(fullName)) {
    errors.push({ field: "customerInfo.fullName", message: "Họ tên không hợp lệ" });
  }
  if (!/^0\d{9}$/.test(phone)) {
    errors.push({ field: "customerInfo.phone", message: "Số điện thoại không hợp lệ" });
  }
  if (address.length < 5 || address.length > 500 || /[<>]/.test(address)) {
    errors.push({ field: "customerInfo.address", message: "Địa chỉ không hợp lệ" });
  }
  if (customerInfo.note !== undefined && (typeof customerInfo.note !== "string" || note.length > 500 || /[<>]/.test(note))) {
    errors.push({ field: "customerInfo.note", message: "Ghi chú không hợp lệ" });
  }
  if (errors.length > 0) {
    throw serviceError(422, "Dữ liệu không hợp lệ", errors, {});
  }

  return { fullName, phone, address, note };
}

function normalizeCartItems(cart) {
  if (!cart?.items || !Array.isArray(cart.items) || cart.items.length === 0) {
    throw serviceError(422, "Giỏ hàng trống", [], {});
  }
  if (cart.items.length > MAX_CART_ITEMS) {
    throw serviceError(422, "Giỏ hàng vượt quá số dòng cho phép", [], {});
  }

  const merged = new Map();
  for (const item of cart.items) {
    const productId = item.productId?.toString();
    if (!mongoose.isObjectIdOrHexString(productId)) {
      throw serviceError(422, "Giỏ hàng chứa sản phẩm không hợp lệ", [], {});
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY_PER_ITEM) {
      throw serviceError(422, "Số lượng trong giỏ hàng không hợp lệ", [], {});
    }

    const currentQuantity = merged.get(productId)?.quantity || 0;
    const quantity = currentQuantity + item.quantity;
    if (quantity > MAX_QUANTITY_PER_ITEM) {
      throw serviceError(422, "Số lượng mỗi sản phẩm tối đa là 10", [], {
        items: [{ productId, quantity, maxQuantity: MAX_QUANTITY_PER_ITEM }],
      });
    }
    merged.set(productId, { productId, quantity });
  }

  return Array.from(merged.values());
}

function effectivePrice(product) {
  const salePrice = Number(product.salePrice);
  const listPrice = Number(product.listPrice);
  if (Number.isFinite(salePrice) && salePrice >= 0 && salePrice < listPrice) {
    return roundMoney(salePrice);
  }
  return roundMoney(listPrice);
}

async function validateCartState(cart, session, options = {}) {
  const normalizedItems = normalizeCartItems(cart);
  const productIds = normalizedItems.map((item) => item.productId);

  let productQuery = Product.find({ _id: { $in: productIds } }).select("name sku categoryId listPrice salePrice stock status");
  if (session) productQuery = productQuery.session(session);
  const products = await productQuery.lean();
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  let categoryQuery = Category.find({
    _id: { $in: products.map((product) => product.categoryId) },
    isActive: true,
  }).select("_id");
  if (session) categoryQuery = categoryQuery.session(session);
  const activeCategories = await categoryQuery.lean();
  const activeCategoryIds = new Set(activeCategories.map((category) => category._id.toString()));

  const inactiveErrors = [];
  const unavailableItems = [];
  for (const item of normalizedItems) {
    const product = productMap.get(item.productId);
    if (!product) {
      inactiveErrors.push({
        field: `items.${item.productId}`,
        message: "Sản phẩm không còn tồn tại",
      });
      unavailableItems.push({ productId: item.productId, name: null, requestedQuantity: item.quantity, reason: "Sản phẩm không còn tồn tại" });
      continue;
    }

    const categoryActive = activeCategoryIds.has(product.categoryId?.toString());
    if (product.status !== "ACTIVE" || !categoryActive) {
      inactiveErrors.push({
        field: `items.${item.productId}`,
        message: "Sản phẩm không còn được phép đặt mua",
      });
      unavailableItems.push({ productId: item.productId, name: product.name, requestedQuantity: item.quantity, reason: "Sản phẩm không còn được phép đặt mua" });
    }
  }

  if (inactiveErrors.length > 0) {
    throw serviceError(422, "Có sản phẩm trong giỏ không còn được phép đặt mua", inactiveErrors, { items: unavailableItems });
  }

  if (!options.skipStockCheck) {
    const stockErrors = [];
    const stockItems = [];
    for (const item of normalizedItems) {
      const product = productMap.get(item.productId);
      const availableQuantity = Math.max(0, Math.min(MAX_QUANTITY_PER_ITEM, Number(product.stock) || 0));
      if (item.quantity > product.stock) {
        stockErrors.push({
          field: `items.${item.productId}`,
          message: "Số lượng vượt quá tồn kho hiện tại",
        });
        stockItems.push({
          productId: item.productId,
          name: product.name,
          requestedQuantity: item.quantity,
          availableQuantity,
        });
      }
    }
    if (stockErrors.length > 0) {
      throw serviceError(422, "Tồn kho không đủ để tạo đơn hàng", stockErrors, { items: stockItems });
    }
  }

  const items = normalizedItems.map((item) => {
    const product = productMap.get(item.productId);
    const unitPrice = effectivePrice(product);
    const subtotal = roundMoney(unitPrice * item.quantity);
    return {
      productId: product._id,
      name: product.name,
      sku: product.sku || undefined,
      unitPrice,
      quantity: item.quantity,
      subtotal,
    };
  });
  const totalAmount = roundMoney(items.reduce((sum, item) => sum + item.subtotal, 0));

  return {
    normalizedItems,
    products,
    productMap,
    items,
    subtotal: totalAmount,
    totalAmount,
    shippingFee: 0,
  };
}

function verifyClientTotal(payload, validated) {
  if (typeof payload.clientTotal !== "number" || !Number.isFinite(payload.clientTotal)) {
    throw serviceError(422, "clientTotal không hợp lệ", [{ field: "clientTotal", message: "clientTotal phải là số hợp lệ" }], {});
  }
  const clientTotal = roundMoney(payload.clientTotal);
  if (clientTotal !== validated.totalAmount) {
    throw serviceError(
      422,
      "Tổng tiền đã thay đổi",
      [{ field: "clientTotal", message: "Tổng tiền hiện tại khác với tổng tiền khách đang hiển thị" }],
      {
        clientTotal,
        subtotal: validated.subtotal,
        shippingFee: validated.shippingFee,
        totalAmount: validated.totalAmount,
        items: validated.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
      },
    );
  }
}

function serializeOrder(order) {
  const plain = typeof order?.toObject === "function" ? order.toObject() : { ...order };
  return {
    orderCode: plain.orderCode,
    status: plain.status,
    customerInfo: {
      fullName: plain.customerInfo.fullName,
      phone: plain.customerInfo.phone,
      address: plain.customerInfo.address,
      note: plain.customerInfo.note || "",
    },
    items: plain.items.map((item) => ({
      name: item.name,
      sku: item.sku || undefined,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    })),
    subtotal: roundMoney(plain.totalAmount - plain.shippingFee),
    shippingFee: plain.shippingFee,
    totalAmount: plain.totalAmount,
    createdAt: plain.createdAt,
  };
}

function maskPhone(phone) {
  if (typeof phone !== "string" || !/^0\d{9}$/.test(phone)) return "***";
  return `${phone.slice(0, 4)}***${phone.slice(-3)}`;
}

function serializeTrackedOrder(order) {
  const plain = typeof order?.toObject === "function" ? order.toObject() : { ...order };
  return {
    orderCode: plain.orderCode,
    status: plain.status,
    customerInfo: {
      fullName: plain.customerInfo.fullName,
      phone: maskPhone(plain.customerInfo.phone),
      address: plain.customerInfo.address,
    },
    items: plain.items.map((item) => ({
      name: item.name,
      sku: item.sku || undefined,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    })),
    subtotal: roundMoney(plain.totalAmount - plain.shippingFee),
    shippingFee: plain.shippingFee,
    totalAmount: plain.totalAmount,
    createdAt: plain.createdAt,
  };
}

function trackCodeMatches(trackCode, storedHash) {
  const candidateBuffer = crypto.createHash("sha256").update(trackCode.toLowerCase(), "utf8").digest();
  const storedBuffer = typeof storedHash === "string" && /^[a-f0-9]{64}$/i.test(storedHash)
    ? Buffer.from(storedHash, "hex")
    : crypto.createHash("sha256").update("techgear:dummy-track-code", "utf8").digest();
  return crypto.timingSafeEqual(candidateBuffer, storedBuffer);
}

export async function trackOrder(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw serviceError(422, "Mã không hợp lệ", [], {});
  }
  if (typeof payload.orderCode !== "string" || typeof payload.trackCode !== "string") {
    throw serviceError(422, "Mã không hợp lệ", [], {});
  }

  const orderCode = payload.orderCode.trim().toUpperCase();
  const trackCode = payload.trackCode.trim().toLowerCase();
  const order = await Order.findOne({ orderCode }).select("+trackHash").lean();

  if (!order || !trackCodeMatches(trackCode, order.trackHash)) {
    throw serviceError(404, "Không tìm thấy đơn hàng hoặc mã tra cứu không chính xác", [], {});
  }

  return serializeTrackedOrder(order);
}

async function findExistingOrder(idempotencyKey, userId) {
  const order = await Order.findOne({ idempotencyKey, userId }).lean();
  if (!order) return null;
  return { order: serializeOrder(order), isIdempotent: true, cartCleared: false };
}

function newOrderCode() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = crypto.randomBytes(5).toString("hex").toUpperCase();
  return `TG-${date}-${suffix}`;
}

async function generateUniqueOrderCode(session) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const orderCode = newOrderCode();
    let query = Order.exists({ orderCode });
    if (session) query = query.session(session);
    if (!(await query)) return orderCode;
  }
  throw serviceError(500, "Không thể sinh mã đơn hàng");
}

async function createOrderDocument(validated, customerInfo, idempotencyKey, orderCode, trackCode, userId) {
  const trackHash = hashText(trackCode);
  return {
    orderCode,
    trackHash,
    idempotencyKey,
    userId,
    customerInfo,
    items: validated.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      sku: item.sku,
      price: item.unitPrice,
      quantity: item.quantity,
      subtotal: item.subtotal,
    })),
    totalAmount: validated.totalAmount,
    shippingFee: 0,
    status: "PENDING",
  };
}

function transactionUnsupported(error) {
  const text = `${error?.message || ""} ${error?.codeName || ""}`;
  return error?.code === 20 ||
    /transaction numbers? are only allowed/i.test(text) ||
    /transaction.*(not supported|not allowed|replica set|unsupported)/i.test(text);
}

async function executeTransaction(operation) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    });
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    if (session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch {
        // Giữ nguyên lỗi nghiệp vụ gốc thay vì che bởi lỗi abort.
      }
    }
    throw error;
  } finally {
    await session.endSession();
  }
}

async function createWithTransaction(cart, payload, customerInfo, userId) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await executeTransaction(async (session) => {
        const cartInTransaction = await Cart.findOne({
          _id: cart._id,
          userId,
          status: "ACTIVE",
          expireAt: { $gt: new Date() },
        }).select("userId items status expireAt").session(session);
        if (!cartInTransaction || cartInTransaction.items.length === 0) {
          throw serviceError(422, "Giỏ hàng trống", [], {});
        }

        const validated = await validateCartState(cartInTransaction, session);
        verifyClientTotal(payload, validated);

        const stockChanges = [];
        for (const item of validated.normalizedItems) {
          const product = validated.productMap.get(item.productId);
          const updated = await Product.findOneAndUpdate(
            {
              _id: product._id,
              categoryId: product.categoryId,
              status: "ACTIVE",
              stock: { $gte: item.quantity },
            },
            { $inc: { stock: -item.quantity } },
            { new: true, runValidators: false, session },
          ).select("stock");

          if (!updated) {
            let current = await Product.findById(product._id).select("name stock").session(session).lean();
            const availableQuantity = Math.max(0, Math.min(MAX_QUANTITY_PER_ITEM, Number(current?.stock) || 0));
            throw serviceError(422, "Tồn kho không đủ để tạo đơn hàng", [{
              field: `items.${product._id.toString()}`,
              message: "Số lượng vượt quá tồn kho hiện tại",
            }], {
              items: [{
                productId: product._id.toString(),
                name: product.name,
                requestedQuantity: item.quantity,
                availableQuantity,
              }],
            });
          }

          stockChanges.push({
            productId: product._id,
            stockBefore: updated.stock + item.quantity,
            stockAfter: updated.stock,
            quantity: item.quantity,
          });
        }

        const orderCode = await generateUniqueOrderCode(session);
        const trackCode = crypto.randomUUID();
        const orderDocument = await createOrderDocument(validated, customerInfo, payload.idempotencyKey, orderCode, trackCode, userId);
        const [order] = await Order.create([orderDocument], { session });

        if (stockChanges.length > 0) {
          await InventoryLog.insertMany(
            stockChanges.map((change) => ({
              productId: change.productId,
              type: "order_create",
              change: -change.quantity,
              stockBefore: change.stockBefore,
              stockAfter: change.stockAfter,
              referenceId: order._id,
              reason: "Tạo đơn hàng tự động",
              actor: "customer",
            })),
            { session },
          );
        }

        await OrderHistory.insertMany([{
          orderId: order._id,
          toStatus: "PENDING",
          actor: "customer",
          reason: "Tạo đơn hàng tự động từ checkout",
        }], { session });

        const cartDelete = await Cart.deleteOne({
          _id: cartInTransaction._id,
          userId,
          status: "ACTIVE",
        }, { session });
        if (cartDelete.deletedCount !== 1) {
          throw serviceError(409, "Giỏ hàng đã thay đổi khi tạo đơn", [], {});
        }

        return {
          order: serializeOrder(order),
          trackCode,
          isIdempotent: false,
          cartCleared: true,
        };
      });
    } catch (error) {
      if (error?.code === 11000) {
        const existing = await findExistingOrder(payload.idempotencyKey, userId);
        if (existing) return { ...existing, cartCleared: true };
        continue;
      }
      throw error;
    }
  }
  throw serviceError(500, "Không thể tạo mã đơn hàng duy nhất");
}

async function compensateStock(decrements) {
  const failures = [];
  for (const decrement of [...decrements].reverse()) {
    try {
      const result = await Product.updateOne(
        { _id: decrement.productId },
        { $inc: { stock: decrement.quantity } },
      );
      if (result.matchedCount !== 1) failures.push(decrement.productId.toString());
    } catch {
      failures.push(decrement.productId.toString());
    }
  }
  if (failures.length > 0) {
    throw serviceError(500, "Không thể hoàn tất hoàn tác tồn kho");
  }
}

async function createWithoutTransaction(cart, payload, customerInfo, userId) {
  const validated = await validateCartState(cart, null);
  verifyClientTotal(payload, validated);

  const decrements = [];
  let createdOrder = null;
  try {
    for (const item of validated.normalizedItems) {
      const currentProduct = await Product.findOne({
        _id: item.productId,
        status: "ACTIVE",
      }).select("_id name categoryId listPrice salePrice stock status");
      if (!currentProduct) {
        throw serviceError(422, "Có sản phẩm trong giỏ không còn được phép đặt mua", [], {
          items: [{ productId: item.productId, reason: "Sản phẩm không còn được phép đặt mua" }],
        });
      }
      const activeCategory = await Category.findOne({
        _id: currentProduct.categoryId,
        isActive: true,
      }).select("_id");
      if (!activeCategory) {
        throw serviceError(422, "Có sản phẩm trong giỏ không còn được phép đặt mua", [], {
          items: [{ productId: item.productId, name: currentProduct.name, reason: "Danh mục không còn hoạt động" }],
        });
      }

      const updated = await Product.findOneAndUpdate(
        {
          _id: currentProduct._id,
          categoryId: currentProduct.categoryId,
          status: "ACTIVE",
          stock: { $gte: item.quantity },
        },
        { $inc: { stock: -item.quantity } },
        { new: true, runValidators: false },
      ).select("stock");
      if (!updated) {
        const stockAfterRead = await Product.findById(currentProduct._id).select("stock name");
        const availableQuantity = Math.max(0, Math.min(MAX_QUANTITY_PER_ITEM, Number(stockAfterRead?.stock) || 0));
        throw serviceError(422, "Tồn kho không đủ để tạo đơn hàng", [{
          field: `items.${item.productId}`,
          message: "Số lượng vượt quá tồn kho hiện tại",
        }], {
          items: [{
            productId: item.productId,
            name: currentProduct.name,
            requestedQuantity: item.quantity,
            availableQuantity,
          }],
        });
      }
      decrements.push({
        productId: currentProduct._id,
        quantity: item.quantity,
        stockBefore: updated.stock + item.quantity,
        stockAfter: updated.stock,
      });
    }

    const finalValidated = await validateCartState(cart, null, { skipStockCheck: true });
    verifyClientTotal(payload, finalValidated);

    const orderCode = await generateUniqueOrderCode(null);
    const trackCode = crypto.randomUUID();
    const orderDocument = await createOrderDocument(finalValidated, customerInfo, payload.idempotencyKey, orderCode, trackCode, userId);
    createdOrder = await Order.create(orderDocument);

    await InventoryLog.insertMany(
      decrements.map((decrement) => {
        return {
          productId: decrement.productId,
          type: "order_create",
          change: -decrement.quantity,
          stockBefore: decrement.stockBefore,
          stockAfter: decrement.stockAfter,
          referenceId: createdOrder._id,
          reason: "Tạo đơn hàng tự động",
          actor: "customer",
        };
      }),
    );

    await OrderHistory.insertMany([{
      orderId: createdOrder._id,
      toStatus: "PENDING",
      actor: "customer",
      reason: "Tạo đơn hàng tự động từ checkout",
    }]);

    const cartDelete = await Cart.deleteOne({
      _id: cart._id,
      userId,
      status: "ACTIVE",
      expireAt: { $gt: new Date() },
    });
    if (cartDelete.deletedCount !== 1) {
      throw serviceError(409, "Giỏ hàng đã thay đổi khi tạo đơn", [], {});
    }

    return {
      order: serializeOrder(createdOrder),
      trackCode,
      isIdempotent: false,
      cartCleared: true,
    };
  } catch (error) {
    if (error?.code === 11000) {
      const existing = await findExistingOrder(payload.idempotencyKey, userId);
      if (existing) {
        await compensateStock(decrements);
        return { ...existing, cartCleared: true };
      }
    }

    const rollbackFailures = [];
    try {
      await compensateStock(decrements);
    } catch (rollbackError) {
      rollbackFailures.push(rollbackError.message || "Không thể hoàn tác tồn kho");
    }

    if (createdOrder) {
      try {
        await InventoryLog.deleteMany({ referenceId: createdOrder._id });
      } catch (cleanupError) {
        rollbackFailures.push(cleanupError.message || "Không thể xóa log tồn kho");
      }
      try {
        await OrderHistory.deleteMany({ orderId: createdOrder._id });
      } catch (cleanupError) {
        rollbackFailures.push(cleanupError.message || "Không thể xóa lịch sử đơn hàng");
      }
      try {
        await Order.deleteOne({ _id: createdOrder._id });
      } catch (cleanupError) {
        rollbackFailures.push(cleanupError.message || "Không thể xóa đơn hàng đã tạo");
      }
    }

    if (rollbackFailures.length > 0) {
      throw serviceError(
        500,
        "Không thể hoàn tất rollback checkout",
        [{ field: "checkout.rollback", message: "Một phần dữ liệu checkout cần được hoàn tác thủ công" }],
        {},
      );
    }
    throw error;
  }
}

export async function createOrder(req, res, payload) {
  const customerInfo = normalizeCustomerInfo(payload.customerInfo);
  const clientTotal = payload.clientTotal;
  if (typeof clientTotal !== "number" || !Number.isFinite(clientTotal) || clientTotal < 0) {
    throw serviceError(422, "clientTotal không hợp lệ", [{ field: "clientTotal", message: "clientTotal phải là số không âm" }], {});
  }
  if (!Number.isSafeInteger(Math.round(clientTotal * 100))) {
    throw serviceError(422, "clientTotal không hợp lệ", [{ field: "clientTotal", message: "clientTotal không hợp lệ" }], {});
  }
  if (typeof payload.idempotencyKey !== "string") {
    throw serviceError(422, "idempotencyKey không hợp lệ", [{ field: "idempotencyKey", message: "idempotencyKey phải là chuỗi UUID/GUID" }], {});
  }

  const userId = req.user.id;
  const existing = await findExistingOrder(payload.idempotencyKey, userId);
  if (existing) {
    return { ...existing, cartCleared: true };
  }

  const cart = await findCheckoutCart(req, null);

  try {
    return await createWithTransaction(cart, payload, customerInfo, userId);
  } catch (error) {
    if (!transactionUnsupported(error) && error?.status !== 422 && error?.status !== 409 && error?.code !== 11000) {
      throw error;
    }
    if (!transactionUnsupported(error)) {
      throw error;
    }
    return createWithoutTransaction(cart, payload, customerInfo, userId);
  }
}
