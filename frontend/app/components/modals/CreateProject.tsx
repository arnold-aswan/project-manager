import React from "react";
import { ProjectStatus, type ProjectDialogProps } from "@/types";
import { z } from "zod";
import { projectSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { FormField as ShadFormField } from "../shared/formfield";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar as CalendarIcon, Loader2 } from "@/assets/icons";
import { dateFormatter } from "@/lib";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useCreateProject } from "@/hooks/useProjects";
import { toast } from "sonner";

export type CreateProjectFormData = z.infer<typeof projectSchema>;

const CreateProject = ({
	isOpen,
	onOpenChange,
	workspaceId,
	workspaceMembers,
}: ProjectDialogProps) => {
	const form = useForm<CreateProjectFormData>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			title: "",
			description: "",
			status: ProjectStatus.PLANNING,
			startDate: "",
			dueDate: "",
			members: [],
			tags: undefined,
		},
	});

	const { mutate, isPending } = useCreateProject();

	const onSubmit = (data: CreateProjectFormData) => {
		if (!workspaceId) return;
		mutate(
			{
				projectData: data,
				workspaceId,
			},
			{
				onSuccess: () => {
					toast.success("project created successfully.");
					form.reset();
					onOpenChange(false);
				},

				onError: (error: any) => {
					const errorMsg =
						error?.response?.data?.message || "Failed to create Project";
					toast.error(errorMsg);
				},
			}
		);
	};
	return (
		<Dialog
			open={isOpen}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-[540px]">
				<DialogHeader>
					<DialogTitle>Create Project</DialogTitle>
					<DialogDescription>
						Create a new project to get started.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<ShadFormField
							label="Project Title"
							name="title"
							type="text"
							placeholder="Project title"
						/>

						<ShadFormField
							label="Project Description"
							name="description"
							type="textarea"
							placeholder="Project description"
						/>

						<ShadFormField
							label="Project Status"
							name="status"
							type="select"
							placeholder="Project status"
							options={Object.values(ProjectStatus)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Start Date</FormLabel>
										<FormControl>
											<Popover modal={true}>
												<PopoverTrigger asChild>
													<Button
														variant={"outline"}
														className={
															"w-full justify-start text-left font-normal" +
															(!field.value ? "text-muted-foreground" : "")
														}
													>
														<CalendarIcon className="size-4 mr-2" />
														{field.value ? (
															dateFormatter(field.value)
														) : (
															<span>Pick a date</span>
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent>
													<Calendar
														mode="single"
														selected={
															field.value ? new Date(field.value) : undefined
														}
														onSelect={(date) => {
															field.onChange(date?.toISOString() || undefined);
														}}
														disabled={(date) =>
															date < new Date(new Date().setHours(0, 0, 0, 0))
														}
													/>
												</PopoverContent>
											</Popover>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* due date */}
							<FormField
								control={form.control}
								name="dueDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Due Date</FormLabel>
										<FormControl>
											<Popover modal={true}>
												<PopoverTrigger asChild>
													<Button
														variant={"outline"}
														className={
															"w-full justify-start text-left font-normal" +
															(!field.value ? "text-muted-foreground" : "")
														}
													>
														<CalendarIcon className="size-4 mr-2" />
														{field.value ? (
															dateFormatter(field.value)
														) : (
															<span>Pick a date</span>
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent>
													<Calendar
														mode="single"
														selected={
															field.value ? new Date(field.value) : undefined
														}
														onSelect={(date) => {
															field.onChange(date?.toISOString() || undefined);
														}}
														disabled={(date) =>
															date < new Date(new Date().setHours(0, 0, 0, 0))
														}
													/>
												</PopoverContent>
											</Popover>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Tags */}
						<ShadFormField
							label="Tags"
							name="tags"
							type="text"
							placeholder="Enter tags separated by a comma"
						/>

						{/* Members */}
						<FormField
							control={form.control}
							name="members"
							render={({ field }) => {
								const selectedMembers = field.value || [];
								return (
									<FormItem>
										<FormLabel>Members</FormLabel>
										<FormControl>
											<Popover modal={true}>
												<PopoverTrigger asChild>
													<Button
														variant={"outline"}
														className={
															"w-full justify-start text-left font-normal min-h-11"
														}
													>
														{selectedMembers.length === 0 ? (
															<span className="text-muted-foreground">
																Select Members
															</span>
														) : selectedMembers.length <= 2 ? (
															selectedMembers?.map((selectedMember) => {
																const membersArray = Array.isArray(
																	workspaceMembers
																)
																	? workspaceMembers
																	: [workspaceMembers];
																const member = membersArray.find(
																	(workspaceMember) =>
																		workspaceMember.user._id ===
																		selectedMember.user
																);
																return `${
																	member?.user?.fullname
																		? member.user.fullname + " - "
																		: ""
																} ${member?.role ? member.role : ""}`;
															})
														) : (
															`${selectedMembers.length} members selected`
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent
													className="w-sm max-w-60 overflow-y-auto"
													align="start"
												>
													<div className="flex flex-col gap-2 border-blue-900">
														{(Array.isArray(workspaceMembers)
															? workspaceMembers
															: [workspaceMembers]
														)?.map((member) => {
															const selectedMember = selectedMembers.find(
																(m) => m.user === member.user._id
															);

															return (
																<div
																	key={member._id}
																	className="flex items-center gap-2 p-2  rounded"
																>
																	<Checkbox
																		checked={!!selectedMember}
																		onCheckedChange={(checked) => {
																			if (checked) {
																				field.onChange([
																					...selectedMembers,
																					{
																						user: member.user._id,
																						role: "contributor",
																					},
																				]);
																			} else {
																				field.onChange(
																					selectedMembers.filter(
																						(m) => m.user !== member.user._id
																					)
																				);
																			}
																		}}
																		id={`member-${member.user._id}`}
																	/>
																	<label
																		htmlFor={`member-${member.user._id}`}
																		className="truncate flex-1"
																	>
																		{member.user.fullname}
																	</label>

																	{selectedMember && (
																		<Select
																			value={selectedMember.role}
																			onValueChange={(role) => {
																				field.onChange(
																					selectedMembers.map((m) =>
																						m.user === member.user._id
																							? {
																									...m,
																									role: role as
																										| "contributor"
																										| "manager"
																										| "viewer",
																							  }
																							: m
																					)
																				);
																			}}
																		>
																			<SelectTrigger>
																				<SelectValue placeholder="Select Role" />
																			</SelectTrigger>
																			<SelectContent>
																				<SelectItem value="manager">
																					Manager
																				</SelectItem>
																				<SelectItem value="contributor">
																					Contributor
																				</SelectItem>
																				<SelectItem value="viewer">
																					Viewer
																				</SelectItem>
																			</SelectContent>
																		</Select>
																	)}
																</div>
															);
														})}
													</div>
												</PopoverContent>
											</Popover>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						<DialogFooter>
							<Button
								type="submit"
								disabled={isPending}
							>
								{isPending ? (
									<>
										<Loader2 className="size-4 mr-2" />
										Creating Project...
									</>
								) : (
									"Create Project"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateProject;
