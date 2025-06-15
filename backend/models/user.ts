import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullname: { type: String, required: true },
		email: { type: String, required: true, unique: true, trim: true },
		password: { type: String, required: true, select: false }, // Password should not be returned in queries
		avatar: { type: String },
		isEmailVerified: { type: Boolean, default: false },
		lastLogin: { type: Date },
		is2FAEnabled: { type: Boolean, default: false },
		twoFAOTP: { type: String, select: false }, // Store OTP securely
		twoFAOTPExpires: { type: Date, select: false }, // Expiry time for OTP
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
