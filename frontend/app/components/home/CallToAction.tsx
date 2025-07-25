import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "@/assets/icons";
import { Link } from "react-router";

const CallToAction = () => {
	return (
		<section className="py-24 px-4">
			<div className="container mx-auto max-w-4xl">
				<div className="gradient-primary rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden">
					{/* Background decoration */}
					<div className="absolute top-0 left-0 w-full h-full opacity-10">
						<div className="absolute top-8 left-8 w-16 h-16 border-2 border-primary-foreground rounded-full"></div>
						<div className="absolute bottom-8 right-8 w-24 h-24 border-2 border-primary-foreground rounded-lg rotate-45"></div>
						<div className="absolute top-1/2 left-1/4 w-8 h-8 bg-primary-foreground rounded-full"></div>
					</div>

					<div className="relative z-10">
						<h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
							Ready to transform your team's productivity?
						</h2>
						<p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
							Join thousands of teams who have streamlined their workflow with
							Spaces. Start your free trial today—no credit card required.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
							<Link to="/sign-in">
								<Button
									size="lg"
									className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-primary-foreground group"
								>
									Start Free Trial
									<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
								</Button>
							</Link>
							<Button
								size="lg"
								variant="ghost"
								className="text-primary-foreground hover:bg-primary-foreground/10"
							>
								Schedule Demo
							</Button>
						</div>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-primary-foreground/90">
							<div className="flex items-center">
								<CheckCircle className="h-5 w-5 mr-2" />
								14-day free trial
							</div>
							<div className="flex items-center">
								<CheckCircle className="h-5 w-5 mr-2" />
								No setup fees
							</div>
							<div className="flex items-center">
								<CheckCircle className="h-5 w-5 mr-2" />
								Cancel anytime
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CallToAction;
