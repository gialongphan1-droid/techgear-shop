import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email không hợp lệ"],
  },
  password: { type: String, required: true, select: false },
  isVerified: { type: Boolean, required: true, default: false },
  verificationToken: { type: String, select: false },
  verificationTokenExpires: { type: Date, select: false },
}, { timestamps: true });

userSchema.index({ verificationToken: 1 }, { sparse: true });

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set("toJSON", {
  transform(_document, returnedObject) {
    delete returnedObject.password;
    delete returnedObject.verificationToken;
    delete returnedObject.verificationTokenExpires;
    delete returnedObject.__v;
    return returnedObject;
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
