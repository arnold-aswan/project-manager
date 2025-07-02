import useAuthStore from "@/stores/authstore";
import type { HeaderProps, Workspace } from "@/types";
import { Button } from "@/components/ui/button";
import { Bell, PlusCircle } from "@/assets/icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useLoaderData } from "react-router";
import WorkspaceAvatar from "../workspace/workspace-avatar";

const Header = ({
	onSelectedWorkspace,
	selectedWorkspace,
	onCreateWorkspace,
}: HeaderProps) => {
	const { user, logout } = useAuthStore.getState();
	const workspaces = useLoaderData() as { workspaces: Workspace[] };
	return (
		<header className="bg-background sticky top-0 z-40 border-b ">
			<nav className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant={"outline"}>
							{selectedWorkspace ? (
								<>
									{selectedWorkspace.color && (
										<WorkspaceAvatar
											color={selectedWorkspace.color}
											name={selectedWorkspace.name}
										/>
									)}
									<span className="font-medium">{selectedWorkspace?.name}</span>
								</>
							) : (
								<span className="font-medium">Select Workspace</span>
							)}
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent>
						<DropdownMenuLabel>Workspaces</DropdownMenuLabel>
						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							{workspaces.workspaces.map((ws) => (
								<DropdownMenuItem
									key={ws._id}
									onClick={() => onSelectedWorkspace(ws)}
								>
									<WorkspaceAvatar
										color={ws.color}
										name={ws.name}
									/>
									<small>{ws.name}</small>
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>

						<DropdownMenuGroup>
							<DropdownMenuItem onClick={onCreateWorkspace}>
								<PlusCircle />
								Create Workspace
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<div className="flex items-center gap-2">
					<Button
						variant={"ghost"}
						size="icon"
					>
						<Bell size={"icon"} />
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button
								variant="ghost"
								className="rounded-full size-8"
							>
								<Avatar className="w-8 h-8">
									<AvatarImage src={user?.profilePicture} />
									<AvatarFallback className=" text-black">
										{user?.fullname?.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Link to="/user/profile">Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</nav>
		</header>
	);
};

export default Header;
