import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const { Schema } = mongoose;

const adminSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email không hợp lệ"],
  },
  password: { type: String, required: true, select: false },
  tokenVersion: { type: Number, required: true, default: 0, min: 0, validate: Number.isInteger },
  lastLogin: { type: Date },
}, { timestamps: true });

adminSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  if (this.password.length < 60) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

adminSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

adminSchema.set("toJSON", {
  transform(_document, returnedObject) {
    delete returnedObject.password;
    delete returnedObject.__v;
    return returnedObject;
  },
});

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
