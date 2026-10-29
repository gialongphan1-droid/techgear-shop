import mongoose from "mongoose";

const { Schema } = mongoose;

const bannerSchema = new Schema({
  title: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  imageUrl: { type: String, required: true, trim: true },
  publicId: { type: String, required: true, trim: true },
  linkUrl: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator(value) {
        if (!/^https?:\/\//i.test(value) && !value.startsWith("/")) return false;
        return !/^javascript:/i.test(value.trim());
      },
      message: "linkUrl không hợp lệ",
    },
  },
  position: { type: String, required: true, trim: true, maxlength: 100 },
  isActive: { type: Boolean, required: true, default: true, index: true },
}, { timestamps: true });

export default mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
