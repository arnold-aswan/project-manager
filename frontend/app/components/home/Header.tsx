import { Link } from "react-router";
import { Button } from "../ui/button";
import { Ungroup } from "@/assets/icons";

const Header = () => {
	return (
		<header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<div className="gradient-primary w-8 h-8 rounded-lg flex items-center justify-center">
						<Ungroup className="h-5 w-5 text-primary-foreground" />
					</div>
					<span className="text-xl font-bold text-foreground">Spaces</span>
				</div>

				<nav className="hidden md:flex items-center space-x-8">
					<a
						href="#features"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Features
					</a>
					<a
						href="#testimonials"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Testimonials
					</a>
					<a
						href="#pricing"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Pricing
					</a>
				</nav>

				<div className="flex items-center space-x-3">
					<Link to="/sign-in">
						<Button
							variant="ghost"
							className="hidden sm:inline-flex"
						>
							Sign In
						</Button>
					</Link>
					<Link to="/sign-up">
						<Button variant="default">Get Started</Button>
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
