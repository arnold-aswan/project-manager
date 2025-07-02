import React from "react";
import type { NoDataFoundProps } from "@/types";
import { LayoutGrid, PlusCircle } from "@/assets/icons";
import { Button } from "./ui/button";

const NoDataFound = ({
	title,
	description,
	buttonText,
	buttonAction,
}: NoDataFoundProps) => {
	return (
		<div className="col-span-full text-center py-12 2xl:py-24 bg-muted/40 rounded-lg ">
			<LayoutGrid className="size-12 mx-auto text-muted-foreground" />
			<h3 className="mt-4 text-lg font-semibold ">{title}</h3>
			<p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto ">
				{description}
			</p>

			<Button
				onClick={buttonAction}
				className="mt-4"
			>
				<PlusCircle className="size-4 mr-2" />
				{buttonText}
			</Button>
		</div>
	);
};

export default NoDataFound;
