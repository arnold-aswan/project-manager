import { Loader2 } from "@/assets/icons";

const Loader = () => {
	return (
		<div className="flex items-center justify-center h-screen">
			<Loader2 className="size-10 text-blue-500 animate-spin " />
		</div>
	);
};

export default Loader;
