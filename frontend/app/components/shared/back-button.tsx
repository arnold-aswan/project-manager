import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { MoveLeft } from "@/assets/icons";

const BackButton = () => {
	const navigate = useNavigate();
	return (
		<Button
			variant={"outline"}
			size={"sm"}
			onClick={() => navigate(-1)}
			className="p-4 mr-4"
		>
			<MoveLeft /> Back
		</Button>
	);
};

export default BackButton;
