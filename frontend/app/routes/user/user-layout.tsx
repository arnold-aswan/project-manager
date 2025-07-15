import { ProtectedRoute } from "@/components/auth/auth-wrapper";
import { Outlet } from "react-router";

const UserLayout = () => {
	return (
		<ProtectedRoute>
			<section className="container max-w-3xl mx-auto py-8 md:py-16">
				<Outlet />
			</section>
		</ProtectedRoute>
	);
};

export default UserLayout;
