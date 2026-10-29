import mongoose from "mongoose";

const { Schema } = mongoose;

const orderHistorySchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, immutable: true, index: true },
  fromStatus: { type: String, enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED", "RETURNED"], immutable: true },
  toStatus: { type: String, required: true, enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED", "RETURNED"], immutable: true },
  actor: { type: String, required: true, trim: true, maxlength: 100, immutable: true },
  reason: { type: String, trim: true, maxlength: 500, immutable: true },
  note: { type: String, trim: true, maxlength: 500, immutable: true },
}, { timestamps: true });

orderHistorySchema.pre(["updateOne", "updateMany", "findOneAndUpdate", "findByIdAndUpdate", "replaceOne"], function rejectUpdate() {
  throw new Error("OrderHistory là dữ liệu bất biến (append-only)");
});

orderHistorySchema.index({ orderId: 1, createdAt: -1 });

export default mongoose.models.OrderHistory || mongoose.model("OrderHistory", orderHistorySchema);
