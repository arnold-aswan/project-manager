import useAuthStore from "@/stores/authstore";
import type { Workspace } from "@/types";
import { useState } from "react";
import {
	Boxes,
	CheckCircle2,
	ChevronsLeft,
	ChevronsRight,
	LayoutDashboard,
	LayoutGrid,
	ListCheck,
	LogOut,
	Settings,
	Users,
	Wrench,
} from "@/assets/icons";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import SidebarNav from "./sidebar-nav";

const Sidebar = ({
	currentWorkspace,
}: {
	currentWorkspace: Workspace | null;
}) => {
	const { logout } = useAuthStore.getState();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const navItems = [
		{
			title: "dashboard",
			href: "/dashboard",
			icon: LayoutDashboard,
		},
		{
			title: "workspaces",
			href: "/workspaces",
			icon: Boxes,
		},
		{
			title: "my tasks",
			href: "/my-tasks",
			icon: ListCheck,
		},
		{
			title: "members",
			href: "/members",
			icon: Users,
		},
		{
			title: "archived",
			href: "/archived",
			icon: CheckCircle2,
		},
		{
			title: "settings",
			href: "/settings",
			icon: Settings,
		},
	];

	return (
		<aside
			className={cn(
				"flex flex-col border-r bg-sidebar transition-all duration-300",
				isCollapsed ? "w-16 md:w-20" : "w-16 md:w-60"
			)}
		>
			<div className="h-14 flex items-center border-b px-4 mb-4 ">
				<Link
					to="/dashboard"
					className="flex items-center"
				>
					{isCollapsed ? (
						<Wrench className="size-6 text-blue-600" />
					) : (
						<div className="flex items-center gap-2">
							<Wrench className="size-6 text-blue-600" />
							<span className="font-semibold text-lg hidden md:block ">
								TaskHub
							</span>
						</div>
					)}
				</Link>

				<Button
					variant={"ghost"}
					size="icon"
					className="ml-auto hidden md:block"
					onClick={() => setIsCollapsed(!isCollapsed)}
				>
					{isCollapsed ? (
						<ChevronsRight className="size-4" />
					) : (
						<ChevronsLeft className="size-4" />
					)}
				</Button>
			</div>

			<ScrollArea className="flex-1 px-3 py-2">
				<SidebarNav
					items={navItems}
					isCollapsed={isCollapsed}
					className={isCollapsed ? "items-center space-y-2" : ""}
					currentWorkspace={currentWorkspace}
				/>
			</ScrollArea>

			<Button
				variant={"ghost"}
				size={isCollapsed ? "icon" : "default"}
				onClick={logout}
			>
				<LogOut className={cn("size-4", isCollapsed && "mr-2")} />
				<span className="hidden md:block">Log out</span>
			</Button>
		</aside>
	);
};

export default Sidebar;
