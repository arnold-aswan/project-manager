import type { Route } from "./+types/home";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import AppPreview from "@/components/home/AppPreview";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Spaces" },
		{
			name: "description",
			content:
				"Welcome to Spaces. A project manager platform for teams and individuals.",
		},
	];
}

const Home = () => {
	return (
		<section className="w-full min-h-screen bg-background ">
			<Header />
			<Hero />
			<Features />
			<AppPreview />
			{/* <Testimonials /> */}
			<CallToAction />
			<Footer />
		</section>
	);
};

export default Home;
