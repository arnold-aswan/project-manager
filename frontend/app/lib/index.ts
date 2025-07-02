export const publicRoutes = [
	"/sign-in",
	"/sign-up",
	"/verify-email",
	"/reset-password",
	"/forgot-password",
	"/",
];

// Predefined Colors
export const colorOptions = [
	"#FF5733",
	"#33C1FF",
	"#28A745",
	"#FFC300",
	"#8E44AD",
	"#E67E22",
	"#2ECC71",
	"#34495E",
];

// Date converter
export const dateFormatter = new Intl.DateTimeFormat("en-KE", {
	dateStyle: "medium",
	timeStyle: "short",
	hour12: true,
});
// returns "Jun 25, 2025, 4:06 PM" (Kenyan time)
