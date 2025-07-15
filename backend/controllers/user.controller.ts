import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { getUser } from "./workspace.controller";

const getUserProfile = async (req: Request, res: Response) => {
	try {
		const user = await getUser(req, res);
		if (!user) return;
		const userInfo = await User.findById(user.userId).select("-password");

		if (!userInfo) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		res.status(200).json(userInfo);
		return;
	} catch (error) {
		console.error("Error fetching user profile:", error);
		res.status(500).json({ message: "Server error" });
		return;
	}
};

const updateUserProfile = async (req: Request, res: Response) => {
	try {
		const { fullname, avatar } = req.body;

		const user = await getUser(req, res);
		if (!user) return;
		const userInfo = await User.findById(user.userId);
		if (!userInfo) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		userInfo.fullname = fullname;
		userInfo.avatar = avatar;

		await userInfo.save();

		res.status(200).json(user);
		return;
	} catch (error) {
		console.error("Error updating user profile:", error);
		res.status(500).json({ message: "Server error" });
		return;
	}
};

const changePassword = async (req: Request, res: Response) => {
	try {
		const { currentPassword, newPassword, confirmPassword } = req.body;

		const user = await getUser(req, res);
		if (!user) return;
		const userInfo = await User.findById(user.userId).select("+password");

		if (!userInfo) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		if (newPassword !== confirmPassword) {
			res
				.status(400)
				.json({ message: "New password and confirm password do not match" });
			return;
		}

		const isPasswordValid = await bcrypt.compare(
			currentPassword,
			userInfo.password
		);

		if (!isPasswordValid) {
			res.status(403).json({ message: "Invalid old password" });
			return;
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		userInfo.password = hashedPassword;
		await userInfo.save();

		res.status(200).json({ message: "Password updated successfully" });
		return;
	} catch (error) {
		console.error("Error changing password:", error);
		res.status(500).json({ message: "Server error" });
		return;
	}
};

export { getUserProfile, updateUserProfile, changePassword };
