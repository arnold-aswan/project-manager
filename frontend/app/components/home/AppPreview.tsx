import dashboardMockup from "@/assets/dashboard-mockup.jpg";

const AppPreview = () => {
	return (
		<section className="py-24 px-4">
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-16 animate-fade-in">
					<h2 className="text-4xl font-bold text-foreground mb-4">
						See Spaces in action
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Our intuitive interface makes project management feel effortless.
						Organize tasks, track progress, and collaborate with your team in
						real-time.
					</p>
				</div>

				<div className="relative animate-slide-up">
					<div className="relative rounded-2xl overflow-hidden shadow-large bg-gradient-subtle p-8">
						<img
							src={dashboardMockup}
							alt="Spaces Dashboard Interface"
							className="w-full h-auto rounded-lg shadow-medium"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
					</div>

					<div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-primary rounded-full opacity-20 blur-xl"></div>
					<div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent rounded-full opacity-20 blur-xl"></div>
				</div>

				<div className="grid md:grid-cols-3 gap-8 mt-16">
					<div
						className="text-center animate-fade-in"
						style={{ animationDelay: "200ms" }}
					>
						<div className="text-3xl font-bold text-primary mb-2">10k+</div>
						<div className="text-muted-foreground">Active Users</div>
					</div>
					<div
						className="text-center animate-fade-in"
						style={{ animationDelay: "400ms" }}
					>
						<div className="text-3xl font-bold text-primary mb-2">500k+</div>
						<div className="text-muted-foreground">Tasks Completed</div>
					</div>
					<div
						className="text-center animate-fade-in"
						style={{ animationDelay: "600ms" }}
					>
						<div className="text-3xl font-bold text-primary mb-2">99.9%</div>
						<div className="text-muted-foreground">Uptime</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AppPreview;
