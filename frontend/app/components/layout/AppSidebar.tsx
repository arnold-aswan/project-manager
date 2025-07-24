import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarRail,
	SidebarSeparator,
	useSidebar,
} from "../ui/sidebar";
import {
	Boxes,
	CheckCircle2,
	LayoutDashboard,
	ListCheck,
	LogOut,
	Settings,
	Users,
	SquaresExclude,
} from "@/assets/icons";
import { Button } from "../ui/button";
import useAuthStore from "@/stores/authstore";
import SidebarNav from "./sidebar-nav";
import type { Workspace } from "@/types";

const AppSidebar = ({
	currentWorkspace,
}: {
	currentWorkspace: Workspace | null;
}) => {
	const { open } = useSidebar();
	const { logout } = useAuthStore.getState();

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
		<Sidebar collapsible={"icon"}>
			<SidebarHeader className="h-14 p-2 flex flex-row items-center justify-center gap-2">
				<SquaresExclude className="size-6 text-blue-600" />
				{open && <span className="font-semibold text-lg">Spaces</span>}
			</SidebarHeader>
			<SidebarSeparator />
			<SidebarContent>
				<SidebarGroup className="px-2">
					<SidebarGroupContent>
						<SidebarNav
							items={navItems}
							isOpen={open}
							className={open ? "items-center space-y-2" : ""}
							currentWorkspace={currentWorkspace}
						/>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<Button
					variant={"outline"}
					size={"icon"}
					onClick={logout}
					className="w-full justify-center cursor-pointer"
				>
					<LogOut className="size-4 text-red-500" />
					{open && <span className=" text-red-500">Log out</span>}
				</Button>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
};

export default AppSidebar;
