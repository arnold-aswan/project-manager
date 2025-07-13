import Loader from "@/components/shared/loader";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetMyTasksQuery } from "@/hooks/useTasks";
import type { Task, Workspace } from "@/types";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowUpRight, CheckCircle, Clock, FilterIcon } from "@/assets/icons";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useGetWorkspaceDetailsQuery } from "@/hooks/useWorkspace";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Members = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const workspaceId = searchParams.get("workspaceId");
	const initialSearch = searchParams.get("search") || "";
	const [search, setSearch] = useState<string>(initialSearch);

	// Sync url with state
	useEffect(() => {
		const params: Record<string, string> = {};
		searchParams.forEach((value, key) => {
			params[key] = value;
		});

		params.search = search;

		setSearchParams(params, { replace: true });
	}, [search]);

	// sync state with url changes (i.e browser back / forward)
	useEffect(() => {
		const urlSearch = searchParams.get("search") || "";
		if (urlSearch !== search) setSearch(urlSearch);
	}, [searchParams]);

	const { data, isPending } = useGetWorkspaceDetailsQuery(workspaceId!) as {
		data: Workspace;
		isPending: boolean;
	};

	if (isPending) <Loader />;
	if (!data || !workspaceId) return <div>No workspace found</div>;

	const filteredMembers = data?.members?.filter(
		(member) =>
			member?.user?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
			member?.user?.email.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<section className="space-y-6">
			<div className="flex items-start md:items-center justify-between">
				<h1 className="text-2xl font-bold">Workspace Members</h1>
			</div>

			<Input
				placeholder="Search members ...."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="max-w-md"
			/>

			<Tabs defaultValue="list">
				<TabsList>
					<TabsTrigger value="list">List View</TabsTrigger>
					<TabsTrigger value="board">Board View</TabsTrigger>
				</TabsList>

				{/* LIST VIEW */}
				<TabsContent value="list">
					<Card>
						<CardHeader>
							<CardTitle>Members</CardTitle>
							<CardDescription>
								{filteredMembers?.length} members in your worksapce
							</CardDescription>
						</CardHeader>

						<CardContent>
							<div className="divide-y">
								{filteredMembers.map((member) => (
									<div
										key={member.user._id}
										className="flex flex-col md:flex-row items-center justify-between p-4 gap-3"
									>
										<div className="flex items-center space-x-4">
											<Avatar className="bg-gray-500">
												<AvatarImage src={member.user.profilePicture} />
												<AvatarFallback>
													{member.user.fullname.toUpperCase().charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium">{member.user.fullname}</p>
												<p className="text-sm text-gray-500">
													{member.user.email}
												</p>
											</div>
										</div>

										<div className="flex items-center space-x-1 ml-11 md:ml-0">
											<Badge
												variant={
													["admin", "owner"].includes(member.role)
														? "destructive"
														: "secondary"
												}
												className="capitalize"
											>
												{member.role}
											</Badge>

											<Badge variant={"outline"}>{data.name}</Badge>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* BOARD VIEW */}
				<TabsContent value="board">
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{filteredMembers.map((member) => (
							<Card
								key={member.user._id}
								className=""
							>
								<CardContent className="p-6 flex flex-col items-center text-center">
									<Avatar className="bg-gray-500 size-20 mb-4">
										<AvatarImage src={member.user.avatar} />
										<AvatarFallback className="uppercase">
											{member.user.fullname.substring(0, 2)}
										</AvatarFallback>
									</Avatar>

									<h3 className="text-lg font-medium mb-2">
										{member.user.fullname}
									</h3>

									<p className="text-sm text-gray-500 mb-4">
										{member.user.email}
									</p>

									<Badge
										variant={
											["admin", "owner"].includes(member.role)
												? "destructive"
												: "secondary"
										}
									>
										{member.role}
									</Badge>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</section>
	);
};

export default Members;
