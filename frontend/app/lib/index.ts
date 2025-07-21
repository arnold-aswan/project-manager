import type { ProjectStatus, TaskStatusFilter } from "@/types";

export const publicRoutes = [
	"/sign-in",
	"/sign-up",
	"/verify-email",
	"/reset-password",
	"/forgot-password",
	"/",
];

// Predefined Colors
export const colorOptions = [
	"#FF5733",
	"#33C1FF",
	"#28A745",
	"#FFC300",
	"#8E44AD",
	"#E67E22",
	"#2ECC71",
	"#34495E",
];

type FormatDateOptions = {
	locale?: string;
	dateStyle?: "full" | "long" | "medium" | "short";
	timeStyle?: "full" | "long" | "medium" | "short";
	hour12?: boolean;
};

// Date converter
export const dateFormatter = (
	date: Date | string,
	options?: FormatDateOptions
): string => {
	const formatter = new Intl.DateTimeFormat(options?.locale || "en-KE", {
		dateStyle: options?.dateStyle || "medium",
		timeStyle: options?.timeStyle,
		hour12: options?.hour12,
	});
	return formatter.format(new Date(date));
};

// formatDate(new Date()); // Default: "Jul 2, 2025"
// formatDate(new Date(), { timeStyle: "short", hour12: true }); // "Jul 2, 2025, 12:35 PM"
// formatDate("2025-07-02T08:00:00Z", { dateStyle: "full" }); // "Wednesday, July 2, 2025"

export const statusColor = (status: ProjectStatus) => {
	switch (status) {
		case "Planning":
			return "px-2 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300";
		case "In Progress":
			return "px-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
		case "Completed":
			return "px-2 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
		case "Cancelled":
			return "px-2 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
		case "On Hold":
			return "px-2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
		default:
			return "px-2 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
	}
};

export const getProjectProgress = (tasks: { status: TaskStatusFilter }[]) => {
	const totalTasks = tasks.length;

	const completedTasks = tasks.filter((task) => task?.status === "Done").length;

	const progress =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
	return progress;
};

export const getTaskPriorityColor = (priority: string) => {
	switch (priority.toLowerCase()) {
		case "high":
			return "bg-red-500 text-white";
		case "medium":
			return "bg-orange-500 text-white";
		default:
			return "bg-slate-500 text-white";
	}
};

export const getTaskPriorityVariant = (priority: string) => {
	switch (priority.toLowerCase()) {
		case "high":
			return "destructive";
		case "medium":
			return "default";
		default:
			return "outline";
	}
};

export const borderColor = (status: string) => {
	switch (status.toLowerCase()) {
		case "to do":
			return " border-blue-400 ";
		case "in progress":
			return " border-amber-400 ";
		case "done":
			return " border-green-400 ";
		default:
			return " border-purple-400 ";
	}
};

export const taskStatusColor = (status: string) => {
	switch (status.toLowerCase()) {
		case "to do":
			return " bg-blue-400 ";
		case "in progress":
			return " bg-amber-400 ";
		case "done":
			return " bg-green-400 ";
		default:
			return " bg-purple-400 ";
	}
};
