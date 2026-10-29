import mongoose from "mongoose";

const { Schema } = mongoose;

const inventoryLogSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, immutable: true, index: true },
  type: { type: String, required: true, immutable: true, enum: ["initial", "order_create", "order_cancel", "admin_add", "admin_subtract", "admin_count", "order_return"] },
  change: { type: Number, required: true, immutable: true, validate: { validator: Number.isInteger, message: "change phải là số nguyên" } },
  stockBefore: { type: Number, required: true, immutable: true, min: 0, validate: { validator: Number.isInteger, message: "stockBefore phải là số nguyên" } },
  stockAfter: { type: Number, required: true, immutable: true, min: 0, validate: { validator: Number.isInteger, message: "stockAfter phải là số nguyên" } },
  referenceId: { type: Schema.Types.ObjectId, ref: "Order", immutable: true },
  reason: { type: String, trim: true, maxlength: 500, immutable: true },
  actor: { type: String, required: true, trim: true, maxlength: 100, immutable: true },
}, { timestamps: true });

inventoryLogSchema.pre(["updateOne", "updateMany", "findOneAndUpdate", "findByIdAndUpdate", "replaceOne"], function rejectUpdate() {
  throw new Error("InventoryLog là dữ liệu bất biến (append-only)");
});

inventoryLogSchema.index({ productId: 1, createdAt: -1 });

export default mongoose.models.InventoryLog || mongoose.model("InventoryLog", inventoryLogSchema);
