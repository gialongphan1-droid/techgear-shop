import mongoose from "mongoose";
import InventoryLog from "../models/InventoryLog.js";
import Order from "../models/Order.js";
import OrderHistory from "../models/OrderHistory.js";
import Product from "../models/Product.js";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
  "RETURNED",
];

const VALID_TRANSITIONS = Object.freeze({
  PENDING: Object.freeze(["CONFIRMED", "CANCELLED"]),
  CONFIRMED: Object.freeze(["PROCESSING", "CANCELLED"]),
  PROCESSING: Object.freeze(["SHIPPED", "COMPLETED", "CANCELLED"]),
  SHIPPED: Object.freeze(["COMPLETED", "RETURNED"]),
  COMPLETED: Object.freeze([]),
  CANCELLED: Object.freeze([]),
  RETURNED: Object.freeze([]),
});

const RESTOCK_STATUSES = new Set(["CANCELLED", "RETURNED"]);
const REASON_REQUIRED_STATUSES = new Set(["CANCELLED", "RETURNED"]);
const PENDING_OVERDUE_MS = 24 * 60 * 60 * 1000;

function serviceError(status, message, errors = [], data = {}) {
  const error = new Error(message);
  error.status = status;
  error.errors = errors;
  error.data = data;
  return error;
}

function asObjectId(value) {
  if (typeof value !== "string" || !mongoose.isObjectIdOrHexString(value)) return null;
  return new mongoose.Types.ObjectId(value);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildActor(admin) {
  const name = typeof admin?.name === "string" && admin.name.trim()
    ? admin.name.trim().slice(0, 100)
    : typeof admin?.email === "string" && admin.email.trim()
      ? admin.email.trim().slice(0, 100)
      : "Admin";
  const email = typeof admin?.email === "string" ? admin.email.trim().slice(0, 254) : null;
  const id = mongoose.isObjectIdOrHexString(admin?.id)
    ? new mongoose.Types.ObjectId(admin.id)
    : null;
  return {
    actor: name,
    actorName: name,
    actorEmail: email || null,
    ...(id ? { actorId: id } : {}),
  };
}

function serializeAdminOrder(order) {
  const plain = typeof order?.toObject === "function" ? order.toObject() : { ...order };
  return {
    id: plain._id?.toString(),
    _id: plain._id?.toString(),
    orderCode: plain.orderCode,
    customerInfo: plain.customerInfo
      ? {
          fullName: plain.customerInfo.fullName,
          phone: plain.customerInfo.phone,
          address: plain.customerInfo.address,
          note: plain.customerInfo.note || "",
        }
      : {},
    items: (plain.items || []).map((item) => ({
      productId: item.productId?.toString(),
      name: item.name,
      sku: item.sku || null,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    })),
    totalAmount: plain.totalAmount,
    shippingFee: plain.shippingFee,
    status: plain.status,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

function serializeHistory(history) {
  const plain = typeof history?.toObject === "function" ? history.toObject() : { ...history };
  return {
    id: plain._id?.toString(),
    _id: plain._id?.toString(),
    orderId: plain.orderId?.toString(),
    fromStatus: plain.fromStatus || null,
    toStatus: plain.toStatus,
    actor: plain.actor,
    reason: plain.reason || null,
    note: plain.note || null,
    createdAt: plain.createdAt,
  };
}

function isTransactionUnsupportedError(error) {
  const text = `${error?.message || ""} ${error?.codeName || ""}`.toLowerCase();
  return text.includes("transaction numbers are only allowed")
    || text.includes("transactions are not supported")
    || text.includes("does not support transactions")
    || text.includes("does not support sessions")
    || text.includes("standalone server")
    || text.includes("standalone mongodb")
    || text.includes("replica set")
    || text.includes("illegaloperation");
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
        // Keep the original business error.
      }
    }
    throw error;
  } finally {
    await session.endSession();
  }
}

export async function listAdminOrders(query = {}) {
  if (!query || typeof query !== "object" || Array.isArray(query)) {
    throw serviceError(422, "Tham số truy vấn không hợp lệ");
  }

  const allowedFields = new Set(["page", "limit", "status", "search", "overdue", "pendingOverdue"]);
  const unknownFields = Object.keys(query).filter((field) => !allowedFields.has(field));
  if (unknownFields.length > 0) {
    throw serviceError(422, "Tham số truy vấn không hợp lệ");
  }
  for (const field of ["page", "limit"]) {
    if (query[field] !== undefined && !["string", "number"].includes(typeof query[field])) {
      throw serviceError(422, `${field} không hợp lệ`);
    }
  }

  const page = Number.parseInt(query.page || "1", 10);
  const limit = Number.parseInt(query.limit || "20", 10);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw serviceError(422, "page hoặc limit không hợp lệ");
  }

  const filter = {};
  if (query.status !== undefined) {
    if (typeof query.status !== "string" || !ORDER_STATUSES.includes(query.status)) {
      throw serviceError(422, "status không hợp lệ");
    }
    filter.status = query.status;
  }

  const overdue = query.overdue === true || query.overdue === "true" || query.overdue === "1"
    || query.pendingOverdue === true || query.pendingOverdue === "true" || query.pendingOverdue === "1";
  if (overdue) {
    filter.status = "PENDING";
    filter.createdAt = { $lte: new Date(Date.now() - PENDING_OVERDUE_MS) };
  }

  if (query.search !== undefined) {
    if (typeof query.search !== "string" || query.search.trim().length > 100) {
      throw serviceError(422, "search không hợp lệ");
    }
    const search = escapeRegex(query.search.trim());
    if (search) {
      filter.$or = [
        { orderCode: { $regex: search, $options: "i" } },
        { "customerInfo.phone": { $regex: search, $options: "i" } },
      ];
    }
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return {
    items: orders.map((order) => serializeAdminOrder(order)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAdminOrderDetail(orderId) {
  const objectId = asObjectId(orderId);
  if (!objectId) {
    throw serviceError(422, "id đơn hàng không hợp lệ");
  }

  const [order, history] = await Promise.all([
    Order.findById(objectId).lean(),
    OrderHistory.find({ orderId: objectId }).sort({ createdAt: 1, _id: 1 }).lean(),
  ]);

  if (!order) {
    throw serviceError(404, "Không tìm thấy đơn hàng");
  }

  return {
    order: serializeAdminOrder(order),
    history: history.map((entry) => serializeHistory(entry)),
  };
}

export async function updateAdminOrderStatus(orderId, payload, admin) {
  const objectId = asObjectId(orderId);
  if (!objectId) {
    throw serviceError(422, "id đơn hàng không hợp lệ");
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw serviceError(422, "Body cập nhật trạng thái không hợp lệ");
  }

  const allowedFields = new Set(["status", "currentStatus", "reason", "note"]);
  const unknownFields = Object.keys(payload).filter((field) => !allowedFields.has(field));
  if (unknownFields.length > 0) {
    throw serviceError(422, "Body chứa trường không được phép");
  }
  if (typeof payload.status !== "string" || !ORDER_STATUSES.includes(payload.status)) {
    throw serviceError(422, "status không hợp lệ");
  }
  if (typeof payload.currentStatus !== "string" || !ORDER_STATUSES.includes(payload.currentStatus)) {
    throw serviceError(422, "currentStatus không hợp lệ");
  }

  const reason = payload.reason === undefined ? "" : payload.reason;
  const note = payload.note === undefined ? "" : payload.note;
  if (typeof reason !== "string" || reason.length > 500 || /[<>]/.test(reason)) {
    throw serviceError(422, "reason không hợp lệ");
  }
  if (typeof note !== "string" || note.length > 500 || /[<>]/.test(note)) {
    throw serviceError(422, "note không hợp lệ");
  }
  const normalizedReason = reason.trim();
  const normalizedNote = note.trim();
  if (normalizedReason.length > 500 || normalizedNote.length > 500) {
    throw serviceError(422, "reason hoặc note vượt quá độ dài cho phép");
  }

  try {
    return await executeTransaction(async (session) => {
      const order = await Order.findById(objectId)
        .select("_id orderCode status items customerInfo totalAmount shippingFee createdAt updatedAt")
        .session(session);

      if (!order) {
        throw serviceError(404, "Không tìm thấy đơn hàng");
      }

      const actualStatus = order.status;
      const validTransitions = VALID_TRANSITIONS[actualStatus] || [];

      if (payload.currentStatus !== actualStatus) {
        throw serviceError(409, "Trạng thái đơn đã thay đổi, vui lòng xem lại đơn hàng", [], {
          currentStatus: actualStatus,
          validTransitions,
        });
      }

      if (!validTransitions.includes(payload.status)) {
        throw serviceError(409, "Chuyển trạng thái không hợp lệ", [], {
          currentStatus: actualStatus,
          validTransitions,
        });
      }

      if (REASON_REQUIRED_STATUSES.has(payload.status) && normalizedReason.length === 0) {
        throw serviceError(422, "reason bắt buộc khi hủy hoặc hoàn đơn trả hàng");
      }

      const updatedOrder = await Order.findOneAndUpdate(
        { _id: objectId, status: actualStatus },
        { $set: { status: payload.status } },
        { new: true, runValidators: true, session },
      ).select("_id orderCode status items customerInfo totalAmount shippingFee createdAt updatedAt");

      if (!updatedOrder) {
        const latestOrder = await Order.findById(objectId).select("status").session(session).lean();
        throw serviceError(409, "Trạng thái đơn đã thay đổi, vui lòng xem lại đơn hàng", [], {
          currentStatus: latestOrder?.status || actualStatus,
          validTransitions: VALID_TRANSITIONS[latestOrder?.status] || [],
        });
      }

      let inventoryRestored = false;
      if (RESTOCK_STATUSES.has(payload.status)) {
        inventoryRestored = true;
        for (const item of order.items || []) {
          const productId = item?.productId;
          const quantity = Number(item?.quantity);
          if (!mongoose.isObjectIdOrHexString(productId) || !Number.isInteger(quantity) || quantity <= 0) {
            throw serviceError(500, "Dữ liệu snapshot sản phẩm của đơn không hợp lệ", [], {
              requiresManualReview: true,
              orderId: objectId.toString(),
            });
          }

          const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId },
            { $inc: { stock: quantity } },
            { new: true, runValidators: false, session },
          ).select("_id stock");

          if (!updatedProduct) {
            throw serviceError(409, "Không thể hoàn kho vì sản phẩm trong đơn không tồn tại", [], {
              orderId: objectId.toString(),
              productId: productId.toString(),
            });
          }

          const stockAfter = updatedProduct.stock;
          const stockBefore = stockAfter - quantity;
          const inventoryLog = new InventoryLog({
            productId,
            type: payload.status === "CANCELLED" ? "order_cancel" : "order_return",
            change: quantity,
            stockBefore,
            stockAfter,
            referenceId: objectId,
            reason: normalizedReason || (
              payload.status === "CANCELLED"
                ? "Hoàn kho khi hủy đơn hàng"
                : "Hoàn kho khi đơn hàng trả lại"
            ),
            ...buildActor(admin),
          });
          await inventoryLog.save({ session });
        }
      }

      const historyDocument = {
        orderId: objectId,
        fromStatus: actualStatus,
        toStatus: payload.status,
        actor: buildActor(admin).actor,
        ...(normalizedReason ? { reason: normalizedReason } : {}),
        ...(normalizedNote ? { note: normalizedNote } : {}),
      };
      const [history] = await OrderHistory.create([historyDocument], { session });

      return {
        order: serializeAdminOrder(updatedOrder),
        history: serializeHistory(history),
        inventoryRestored,
        validTransitions: VALID_TRANSITIONS[payload.status] || [],
      };
    });
  } catch (error) {
    if (error?.status) throw error;
    if (isTransactionUnsupportedError(error)) {
      throw serviceError(500, "MongoDB transaction không khả dụng; trạng thái đơn chưa được thay đổi", [], {
        requiresTransaction: true,
      });
    }
    throw error;
  }
}
