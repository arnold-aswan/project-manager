import useAuthStore from "@/stores/authstore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../shared/loader";

interface AuthWrapperProps {
	children: React.ReactNode;
	redirectTo?: string;
	requireAuth?: boolean;
}

const AuthWrapper = ({
	children,
	redirectTo = "/sign-in",
	requireAuth = true,
}: AuthWrapperProps) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const navigate = useNavigate();
	const [isClient, setIsClient] = useState(false);
	const [redirecting, setRedirecting] = useState(false);

	useEffect(() => {
		setIsClient(true);

		if (requireAuth && !isAuthenticated) {
			setRedirecting(true);
			navigate(redirectTo, { replace: true });
		} else if (!requireAuth && isAuthenticated) {
			setRedirecting(true);
			navigate("/dashboard", { replace: true });
		}
	}, [isAuthenticated, requireAuth, redirectTo, navigate]);

	if (!isClient || redirecting) {
		return <Loader />;
	}

	return <>{children}</>;
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	return <AuthWrapper requireAuth={true}>{children}</AuthWrapper>;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
	return <AuthWrapper requireAuth={false}>{children}</AuthWrapper>;
};
