import { Outlet } from "react-router";
import { ProtectedRoute } from "@/components/auth/auth-wrapper";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/authstore";
import Header from "@/components/layout/header";
import { useState } from "react";
import type { Workspace } from "@/types";
import Sidebar from "@/components/layout/sidebar";
import CreateWorkspace from "@/components/workspace/create-workspace";

const DashboardLayout = () => {
	const { logout } = useAuthStore.getState();
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
				{/* Sidebar */}
				<Sidebar currentWorkspace={currentWorkspace} />

				<div className="flex flex-1 flex-col h-full">
					{/*Header */}
					<Header
						onSelectedWorkspace={handleSelectWorkspace}
						selectedWorkspace={currentWorkspace}
						onCreateWorkspace={() => setIsCreatingWorkspace(true)}
					/>

					<main className="flex-1 ">
						<div className="mx-auto container px-2 sm:px-6 lg:px-8 md:py-8 w-full h-full">
							<Outlet />
						</div>
					</main>
				</div>

				<CreateWorkspace
					isCreatingWorkspace={isCreatingWorkspace}
					setIsCreatingWorkspace={setIsCreatingWorkspace}
				/>
			</section>
		</ProtectedRoute>
	);
};

export default DashboardLayout;
