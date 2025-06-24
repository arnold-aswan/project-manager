import express from "express";
import authRoutes from "./auth.routes";
import workspaceRoutes from "./workspace.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);

export default router;
