import useAuthStore from "@/stores/authstore";
import { Navigate, Outlet } from "react-router";

const AuthLayout = () => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	if (isAuthenticated) {
		return <Navigate to="/dashboard" />;
	}

	return <Outlet />;
};

export default AuthLayout;
