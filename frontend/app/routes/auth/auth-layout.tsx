import { Outlet } from "react-router";
import { PublicRoute } from "@/components/auth/auth-wrapper";

const AuthLayout = () => {
	return (
		<PublicRoute>
			<Outlet />
		</PublicRoute>
	);
};

export default AuthLayout;
