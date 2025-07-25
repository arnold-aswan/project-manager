import { Ungroup } from "@/assets/icons";

const Footer = () => {
	return (
		<footer className="bg-accent text-accent-foreground py-12 px-4">
			<div className="container mx-auto max-w-6xl">
				<div className="grid md:grid-cols-4 gap-8">
					<div className="md:col-span-2">
						<div className="flex items-center space-x-2 mb-4">
							<div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
								<Ungroup className="h-5 w-5 text-primary-foreground" />
							</div>
							<span className="text-xl font-bold">Spaces</span>
						</div>
						<p className="text-accent-foreground/80 mb-4 max-w-md">
							Empowering teams to collaborate effectively and deliver projects
							on time. The modern way to manage work.
						</p>
						<div className="text-sm text-accent-foreground/60">
							© 2025 Spaces. All rights reserved.
						</div>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Product</h3>
						<ul className="space-y-2 text-sm text-accent-foreground/80">
							<li>
								<a
									href="#"
									className="hover:text-accent-foreground transition-colors"
								>
									Features
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-accent-foreground transition-colors"
								>
									Pricing
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-accent-foreground transition-colors"
								>
									Integrations
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-accent-foreground transition-colors"
								>
									API
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Company</h3>
						<ul className="space-y-2 text-sm text-accent-foreground/80">
							<li>
								<a
									href="#"
									className="hover:text-accent-foreground transition-colors"
								>
									About
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-accent-foreground transition-colors"
								>
									Blog
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-accent-foreground transition-colors"
								>
									Careers
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-accent-foreground transition-colors"
								>
									Contact
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
