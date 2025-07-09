import {
	Building2,
	CheckCircle,
	CheckCircle2,
	CheckSquare,
	FileEdit,
	FolderEdit,
	FolderPlus,
	LogIn,
	MessageSquare,
	Upload,
	UserMinus,
	UserPlus,
} from "@/assets/icons";
import type { ActionType } from "@/types";

export const getActivityIcon = (action: ActionType) => {
	const iconStyle = "h-5 w-5 rounded-full";
	const wrapper = (icon: React.ReactNode, bg: string) => (
		<div className={`p-2 rounded-md ${bg}`}>{icon}</div>
	);

	switch (action) {
		case "created_task":
			return wrapper(
				<CheckSquare className={`${iconStyle} text-blue-500`} />,
				"bg-blue-100"
			);
		case "created_subtask":
			return wrapper(
				<CheckSquare className={`${iconStyle} text-blue-500`} />,
				"bg-blue-100"
			);
		case "updated_task":
		case "updated_subtask":
			return wrapper(
				<FileEdit className={`${iconStyle} text-indigo-500`} />,
				"bg-indigo-100"
			);
		case "completed_task":
			return wrapper(
				<CheckCircle className={`${iconStyle} text-green-500`} />,
				"bg-green-100"
			);
		case "created_project":
			return wrapper(
				<FolderPlus className={`${iconStyle} text-green-500`} />,
				"bg-green-100"
			);
		case "updated_project":
			return wrapper(
				<FolderEdit className={`${iconStyle} text-indigo-500`} />,
				"bg-indigo-100"
			);
		case "completed_project":
			return wrapper(
				<CheckCircle2 className={`${iconStyle} text-green-500`} />,
				"bg-green-100"
			);
		case "created_workspace":
			return wrapper(
				<Building2 className={`${iconStyle} text-blue-500`} />,
				"bg-blue-100"
			);
		case "added_comment":
			return wrapper(
				<MessageSquare className={`${iconStyle} text-yellow-500`} />,
				"bg-yellow-100"
			);
		case "added_member":
			return wrapper(
				<UserPlus className={`${iconStyle} text-cyan-500`} />,
				"bg-cyan-100"
			);
		case "removed_member":
			return wrapper(
				<UserMinus className={`${iconStyle} text-red-500`} />,
				"bg-red-100"
			);
		case "joined_workspace":
			return wrapper(
				<LogIn className={`${iconStyle} text-teal-500`} />,
				"bg-teal-100"
			);
		case "added_attachment":
			return wrapper(
				<Upload className={`${iconStyle} text-purple-500`} />,
				"bg-purple-100"
			);
		default:
			return null;
	}
};
