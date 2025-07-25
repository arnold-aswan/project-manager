import { Kanban, Users, Bell, Layers } from "@/assets/icons";
import { Card, CardContent } from "../ui/card";

const features = [
	{
		icon: Kanban,
		title: "Task Boards",
		description:
			"Visualize your workflow with intuitive kanban boards. Drag and drop tasks between columns to track progress.",
	},
	{
		icon: Users,
		title: "Team Collaboration",
		description:
			"Work seamlessly with your team. Share files, leave comments, and keep everyone aligned on project goals.",
	},
	{
		icon: Bell,
		title: "Real-Time Notifications",
		description:
			"Stay updated with instant notifications. Never miss important deadlines or team communications.",
	},
	{
		icon: Layers,
		title: "Workspace Management",
		description:
			"Organize multiple projects in dedicated workspaces. Keep different teams and projects perfectly separated.",
	},
];

const Features = () => {
	return (
		<section
			id="features"
			className="py-24 px-4 gradient-subtle"
		>
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-16 animate-fade-in">
					<h2 className="text-4xl font-bold text-foreground mb-4">
						Everything you need to stay organized
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Powerful features designed to help teams of all sizes collaborate
						effectively and deliver projects on time.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-border bg-card/50 backdrop-blur-sm animate-scale-in"
							style={{ animationDelay: `${index * 100}ms` }}
						>
							<CardContent className="p-6 text-center">
								<div className=" w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
									<feature.icon className="h-6 w-6 text-primary-foreground" />
								</div>
								<h3 className="text-lg font-semibold text-foreground mb-2">
									{feature.title}
								</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{feature.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;
