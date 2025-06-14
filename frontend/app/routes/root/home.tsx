import React from "react";
import type { Route } from "./+types/home";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "TaskHub" },
		{ name: "description", content: "Welcome to TaskHub!" },
	];
}

const Home = () => {
	return (
		<section className="w-full h-screen flex items-center justify-center gap-4">
			<Link to="/sign-in">
				<Button className="bg-blue-500 text-white">Login</Button>
			</Link>

			<Link to="/sign-in">
				<Button
					variant={"outline"}
					className="bg-blue-500 text-white"
				>
					Sign Up
				</Button>
			</Link>
		</section>
	);
};

export default Home;
