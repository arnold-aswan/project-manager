import express from "express";
import authRoutes from "./auth.routes";
import workspaceRoutes from "./workspace.routes";
import projectRoutes from "./project.routes";
import taskRoutes from "./task.routes";
import userRoutes from "./user.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/user", userRoutes);

export default router;
