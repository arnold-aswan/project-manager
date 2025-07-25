import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "./routes/index";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		credentials: true, // Allow cookies to be sent with requests
	})
);
app.use(express.json());
app.use(morgan("dev")); // Logging middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB connection
// Enhanced MongoDB connection with timeout and detailed logging
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
			serverSelectionTimeoutMS: 10000,
			socketTimeoutMS: 45000,
			bufferCommands: false,
		});

		console.log(`MongoDB Connected: ${conn.connection.host}`);
		console.log(`Database: ${conn.connection.name}`);
	} catch (error: any) {
		console.error("MongoDB connection failed:", error.message);
		process.exit(1);
	}
};

connectDB();

app.get("/", async (req, res) => {
	res.status(200).json({ message: "Welcome to the Spaces backend!" });
});

// ROUTES
app.use("/api-v1", routes);

// ERROR MIDDLEWARE
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack, "Error occurred");
	res.status(500).json({ message: "Internal Server Error" });
	next();
});

// NOT FOUND MIDDLEWARE
app.use((req: Request, res: Response) => {
	res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
