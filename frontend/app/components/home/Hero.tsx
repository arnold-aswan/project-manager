import { Button } from "../ui/button";
import { ArrowRight, Play } from "@/assets/icons";
import heroImage from "@/assets/hero-image.jpg";
import { Link } from "react-router";

const Hero = () => {
	return (
		<section className="gradient-hero pt-20 pb-32 px-4">
			<div className="container mx-auto max-w-6xl">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div className="animate-fade-in">
						<h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
							Organize your team's work{" "}
							<span className="gradient-primary bg-clip-text text-transparent">
								effortlessly
							</span>
						</h1>
						<p className="text-xl text-muted-foreground mb-8 max-w-lg">
							Manage tasks, collaborate with your team, and hit deadlines—all in
							one place. Perfect for remote teams and growing startups.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<Link to="/sign-in">
								<Button
									size="lg"
									variant="default"
									className="group"
								>
									Get Started
									<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
								</Button>
							</Link>
							<Button
								size="lg"
								className="group"
							>
								<Play className="mr-2 h-4 w-4" />
								Watch Demo
							</Button>
						</div>
						<div className="mt-8 flex items-center space-x-6 text-sm text-muted-foreground">
							<div className="flex items-center">
								<span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
								Free 14-day trial
							</div>
							<div className="flex items-center">
								<span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
								No credit card required
							</div>
						</div>
					</div>

					<div className="animate-slide-up">
						<div className="relative">
							<img
								src={heroImage}
								alt="Team collaboration workspace"
								className="w-full h-auto rounded-2xl shadow-large"
							/>
							<div className="absolute inset-0 gradient-primary opacity-10 rounded-2xl"></div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
