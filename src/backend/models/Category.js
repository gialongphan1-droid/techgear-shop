import mongoose from "mongoose";

const { Schema } = mongoose;

function toSlug(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const categorySchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, trim: true, maxlength: 500 },
  iconUrl: { type: String, trim: true },
  isActive: { type: Boolean, required: true, default: true, index: true },
}, { timestamps: true });

categorySchema.pre("validate", function generateSlug(next) {
  if (!this.slug && this.name) this.slug = toSlug(this.name);
  next();
});

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
