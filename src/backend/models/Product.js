import mongoose from "mongoose";

const { Schema } = mongoose;

const imageSchema = new Schema({
  url: { type: String, required: true, trim: true },
  isPrimary: { type: Boolean, default: false },
  publicId: { type: String, required: true, trim: true },
}, { _id: false });

const specSchema = new Schema({
  key: { type: String, trim: true, maxlength: 100 },
  name: { type: String, trim: true, maxlength: 100 },
  value: { type: String, trim: true, maxlength: 500 },
  unit: { type: String, trim: true, maxlength: 50 },
}, { _id: false });

const seoSchema = new Schema({
  title: { type: String, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 500 },
  keywords: [{ type: String, trim: true, maxlength: 100 }],
}, { _id: false });

function toSlug(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const productSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true, minlength: 2, maxlength: 100 },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
  brand: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
  listPrice: {
    type: Number,
    required: true,
    min: 0,
    validate: { validator: Number.isFinite, message: "listPrice phải là số hữu hạn" },
  },
  salePrice: {
    type: Number,
    min: 0,
    validate: {
      validator(value) {
        return value == null || value < this.listPrice;
      },
      message: "salePrice phải nhỏ hơn listPrice",
    },
  },
  stock: { type: Number, required: true, default: 0, min: 0, validate: { validator: Number.isInteger, message: "stock phải là số nguyên" } },
  status: { type: String, required: true, enum: ["ACTIVE", "PAUSED", "INACTIVE"], default: "ACTIVE", index: true },
  images: { type: [imageSchema], required: true, validate: { validator: (images) => images.length > 0, message: "Product cần ít nhất một ảnh" } },
  specs: [specSchema],
  warranty: { type: String, trim: true, maxlength: 200 },
  seo: seoSchema,
  viewCount: { type: Number, required: true, default: 0, min: 0, validate: { validator: Number.isInteger, message: "viewCount phải là số nguyên" } },
}, { timestamps: true });

productSchema.pre("validate", function generateSlug(next) {
  if (!this.slug && this.name) this.slug = toSlug(this.name);
  next();
});

productSchema.index({ status: 1, categoryId: 1 });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
