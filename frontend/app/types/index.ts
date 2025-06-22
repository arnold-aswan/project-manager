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

interface SidebarNavItems {
	title: string;
	href: string;
	icon: LucideIcon;
}
[];

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
