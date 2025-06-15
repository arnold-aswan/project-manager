export interface User {
	_id: string;
	name: string;
	email: string;
}
export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	loginSuccess: (user: User) => void;
	logout: () => void;
}
