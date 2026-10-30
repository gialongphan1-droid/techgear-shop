import mongoose from "mongoose";

const { Schema } = mongoose;

const cartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1, max: 10, validate: { validator: Number.isInteger, message: "quantity phải là số nguyên" } },
}, { _id: false });

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  tokenHash: { type: String, required: true, unique: true, select: false },
  items: {
    type: [cartItemSchema],
    default: [],
    validate: { validator: (items) => items.length <= 20, message: "Giỏ hàng tối đa 20 dòng" },
  },
  status: { type: String, required: true, enum: ["ACTIVE", "PROCESSING", "CONVERTED"], default: "ACTIVE", index: true },
  expireAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true });

cartSchema.index(
  { userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $type: "objectId" }, status: "ACTIVE" } },
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
