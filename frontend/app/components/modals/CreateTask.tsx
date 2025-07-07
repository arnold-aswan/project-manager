import type { taskSchema } from "@/lib/schema";
import type { CreateTaskDialogProps } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTaskMutation } from "@/hooks/useTasks";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
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

export type CreateTaskFormData = z.infer<typeof taskSchema>;

const CreateTaskDialog = ({
	open,
	onOpenChange,
	projectId,
	projectMembers,
}: CreateTaskDialogProps) => {
	const form = useForm<CreateTaskFormData>({
		defaultValues: {
			title: "",
			description: "",
			assignees: [],
			status: "To Do",
			priority: "Medium",
			dueDate: "",
			projectId: projectId!,
		},
	});

	const { mutate: createTask, isPending, isSuccess } = useCreateTaskMutation();

	const onSubmit = (data: CreateTaskFormData) => {
		createTask(
			{ projectId: projectId!, taskData: data },
			{
				onSuccess: () => {
					toast.success("Task created successfully!");
					form.reset();
					onOpenChange(false);
				},
				onError: (error: any) => {
					toast.error(
						error?.response?.data?.message || "Uh Oh, failed to create task!"
					);
					console.error("Error creating task:", error);
				},
			}
		);
	};
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Task</DialogTitle>
				</DialogHeader>

				{/* form */}
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<div className="grid gap-4 py-4">
							<ShadFormField
								label="Task Title"
								name="title"
								type="text"
								placeholder="Task title"
							/>

							<ShadFormField
								label="Task Description"
								name="description"
								type="textarea"
								placeholder="Task description"
							/>

							<div className="grid gap-4 md:grid-cols-2">
								<ShadFormField
									label="Status"
									name="status"
									type="select"
									placeholder="Project status"
									options={["To Do", "In Progress", "Done"]}
								/>

								<ShadFormField
									label="Priority"
									name="priority"
									type="select"
									placeholder="Priority"
									options={["Low", "Medium", "High"]}
								/>
							</div>

							{/*  Due Date */}
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

							{/* Assignees */}
							<FormField
								control={form.control}
								name="assignees"
								render={({ field }) => {
									const selectedMembers = field.value || [];
									return (
										<FormItem>
											<FormLabel>Assignees</FormLabel>
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
																	Select Assignees
																</span>
															) : selectedMembers.length <= 2 ? (
																selectedMembers
																	?.map((selectedMember) => {
																		const membersArray = Array.isArray(
																			projectMembers
																		)
																			? projectMembers
																			: [projectMembers];
																		const member = membersArray.find(
																			(projectMember) =>
																				projectMember.user._id ===
																				selectedMember
																		);
																		return `${
																			member?.user?.fullname
																				? member.user.fullname + " - "
																				: ""
																		} ${member?.role ? member.role : ""}`;
																	})
																	.join(", ")
															) : (
																`${selectedMembers.length} assignees selected`
															)}
														</Button>
													</PopoverTrigger>
													<PopoverContent
														className="w-sm max-w-60 overflow-y-auto"
														align="start"
													>
														<div className="flex flex-col gap-2 border-blue-900">
															{(Array.isArray(projectMembers)
																? projectMembers
																: [projectMembers]
															)?.map((member) => {
																const selectedMember = selectedMembers.find(
																	(m) => m === member.user?._id
																);

																return (
																	<div
																		key={member.user._id}
																		className="flex items-center gap-2 p-2  rounded"
																	>
																		<Checkbox
																			checked={!!selectedMember}
																			onCheckedChange={(checked) => {
																				if (checked) {
																					field.onChange([
																						...selectedMembers,
																						member.user._id,
																					]);
																				} else {
																					field.onChange(
																						selectedMembers.filter(
																							(m) => m !== member.user._id
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
						</div>

						<DialogFooter>
							<Button
								type="submit"
								disabled={isPending}
							>
								{isPending ? (
									<>
										<Loader2 className="size-4 mr-2" />
										Creating Task...
									</>
								) : (
									"Create Task"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateTaskDialog;
