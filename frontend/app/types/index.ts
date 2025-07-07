import type { LucideIcon } from "lucide-react";
export interface User {
	_id: string;
	fullname: string;
	email: string;
	isEmailVerified: boolean;
	is2FAEnabled: boolean;
	createdAt: Date; // ISO timestamp
	updatedAt: Date;
	lastLogin: string;
	profilePicture?: string;
	avatar?: string;
	__v: number;
}
export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	loginSuccess: (user: User) => void;
	logout: () => void;
}

export interface Workspace {
	_id: string;
	name: string;
	description?: string;
	owner: User | string;
	color: string;
	members: {
		user: User;
		role: "admin" | "member" | "owner" | "viewer";
		joinedAt: Date;
	}[];
	createdAt: Date;
	updatedAt: Date;
}

export interface Project {
	_id: string;
	title: string;
	description?: string;
	workspace: Workspace;
	status: ProjectStatus;
	startDate: Date;
	dueDate: Date;
	progress: Number;
	tasks: Task[];
	members: {
		user: User;
		role: "admin" | "member" | "owner" | "viewer";
	};
	tags?: string[];
	createdBy: User;
	isArchived: boolean;
}

export enum ProjectStatus {
	PLANNING = "Planning",
	IN_PROGRESS = "In Progress",
	ON_HOLD = "On Hold",
	COMPLETED = "Completed",
	CANCELLED = "Cancelled",
}

export interface Task {
	_id: string;
	title: string;
	description?: string;
	project: Project;
	status: TaskStatus | "To Do" | "In Progress" | "Done";
	priority: "Low" | "Medium" | "High";
	assignees: User[];
	watchers?: User[];
	dueDate: Date;
	completedAt: Date;
	estimatedHours: number;
	actualHours: number;
	tags?: string[];
	subTasks?: SubTask[];
	// comments: Types.ObjectId[];
	attachments?: Attachment[];
	createdBy: User | string;
	isArchived: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export enum TaskStatus {
	TO_DO = "TO DO",
	IN_PROGRESS = "In Progress",
	REVIEW = "Review",
	DONE = "Done",
}

export interface SubTask {
	title: string;
	completed?: boolean;
	createdAt?: Date;
}

export interface Attachment {
	fileName: string;
	fileUrl: string;
	fileType?: string;
	fileSize?: number;
	uploadedBy?: User | string;
	uploadedAt?: Date;
}

interface SidebarNavItems {
	title: string;
	href: string;
	icon: LucideIcon;
}
[];
export interface NoDataFoundProps {
	title: string;
	description: string;
	buttonText: string;
	buttonAction: () => void;
}

// COMPONENT PROPS
export interface HeaderProps {
	onSelectedWorkspace: (workspace: Workspace) => void;
	selectedWorkspace: Workspace | null;
	onCreateWorkspace: () => void;
}

export interface SidebarNavProps {
	items: SidebarNavItems[];
	isCollapsed: boolean;
	className: string;
	currentWorkspace: Workspace | null;
}

export interface CreateWorkspaceProps {
	isCreatingWorkspace: boolean;
	setIsCreatingWorkspace: (isCreatingWorkSpace: boolean) => void;
}

export interface ProjectCardProps {
	project: Project;
	progress: Number;
	workspaceId: string;
}

export interface ProjectDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	workspaceId: string;
	workspaceMembers: MemberProps;
}

export interface MemberProps {
	_id: string;
	user: User;
	role: "admin" | "member" | "owner" | "viewer";
	joinedAt: Date;
}

export type TaskStatusFilter = "To Do" | "In Progress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";
export enum ProjectMemberRole {
	MANAGER = "manager",
	CONTRIBUTOR = "contributor",
	VIEWER = "viewer",
}

export interface CreateTaskDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectId: string;
	projectMembers: { user: User; role: ProjectMemberRole }[];
}
