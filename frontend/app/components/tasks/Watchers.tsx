import type { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Watchers = ({ watchers }: { watchers: User[] }) => {
	return (
		<div className="bg-card rounded-lg p-6 shadow-sm mb-6">
			<h3 className="text-lg font-medium mb-4">Watchers</h3>

			<div className="space-y-2  ">
				{watchers && watchers?.length > 0 ? (
					watchers?.map((watcher) => (
						<div key={watcher?._id}>
							<Avatar>
								<AvatarImage
									src={watcher?.avatar}
									alt="avatar"
								/>
								<AvatarFallback className="flex items-center justify-evenly">
									{watcher?.fullname?.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<small className="capitalize">{watcher?.fullname}</small>
						</div>
					))
				) : (
					<small className="text-muted-foreground">No Watchers</small>
				)}
			</div>
		</div>
	);
};

export default Watchers;
