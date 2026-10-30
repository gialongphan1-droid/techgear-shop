import mongoose from "mongoose";

const { Schema } = mongoose;

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  image: { type: String, trim: true },
  sku: { type: String, trim: true, maxlength: 100 },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1, validate: { validator: Number.isInteger, message: "quantity phải là số nguyên" } },
  subtotal: { type: Number, required: true, min: 0 },
}, { _id: false });

const customerInfoSchema = new Schema({
  fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  phone: { type: String, required: true, trim: true, match: [/^0\d{9}$/, "Số điện thoại phải gồm đúng 10 chữ số"] },
  address: { type: String, required: true, trim: true, minlength: 5, maxlength: 500 },
  note: { type: String, trim: true, maxlength: 500, default: "" },
}, { _id: false });

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  orderCode: { type: String, required: true, unique: true, trim: true },
  trackHash: { type: String, required: true, unique: true, select: false },
  idempotencyKey: { type: String, required: true, unique: true, trim: true },
  customerInfo: { type: customerInfoSchema, required: true },
  items: { type: [orderItemSchema], required: true, validate: { validator: (items) => items.length > 0, message: "Đơn hàng cần ít nhất một sản phẩm" } },
  totalAmount: { type: Number, required: true, min: 0 },
  shippingFee: { type: Number, required: true, default: 0, min: 0 },
  status: { type: String, required: true, enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED", "RETURNED"], default: "PENDING", index: true },
  payment: { type: Schema.Types.Mixed, default: undefined },
}, { timestamps: true });

orderSchema.index({ createdAt: -1, status: 1 });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
