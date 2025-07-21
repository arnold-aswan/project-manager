import { Outlet } from "react-router";
import { ProtectedRoute } from "@/components/auth/auth-wrapper";
import Header from "@/components/layout/header";
import { useState } from "react";
import type { Workspace } from "@/types";
import CreateWorkspace from "@/components/workspace/create-workspace";
import { fetchData } from "@/lib/fetch-utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";
import { toast } from "sonner";

// Prefetch workspace data
export const clientLoader = async () => {
	try {
		const [workspaces] = await Promise.all([fetchData("/workspaces")]);
		return { workspaces };
	} catch (error) {
		toast.error("Uh oh could'nt fetch workspaces");
	}
};

const DashboardLayout = () => {
	const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
		null
	);
	const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

	const handleSelectWorkspace = (workspace: Workspace) => {
		setCurrentWorkspace(workspace);
	};

	return (
		<ProtectedRoute>
			<section className="h-screen w-full flex">
				{/* <Sidebar currentWorkspace={currentWorkspace} /> */}
				{/* Sidebar */}
				<SidebarProvider>
					<AppSidebar currentWorkspace={currentWorkspace} />
					<div className="flex flex-1 flex-col h-full">
						<div className="flex items-center gap-2 ">
							<SidebarTrigger />
							{/*Header */}
							<Header
								onSelectedWorkspace={handleSelectWorkspace}
								selectedWorkspace={currentWorkspace}
								onCreateWorkspace={() => setIsCreatingWorkspace(true)}
							/>
						</div>

						<main className="flex-1 ">
							<div className="mx-auto container px-2 sm:px-6 lg:px-8 md:py-8 w-full h-full">
								<Outlet />
							</div>
						</main>
					</div>
				</SidebarProvider>

				<CreateWorkspace
					isCreatingWorkspace={isCreatingWorkspace}
					setIsCreatingWorkspace={setIsCreatingWorkspace}
				/>
			</section>
		</ProtectedRoute>
	);
};

export default DashboardLayout;
