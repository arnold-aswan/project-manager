import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);

const VerificationToken = mongoose.model(
	"VerificationToken",
	verificationSchema
);

export default VerificationToken;
