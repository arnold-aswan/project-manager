import { model, Schema } from "mongoose";

const projectSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, trim: true },
		workspace: {
			type: Schema.Types.ObjectId,
			ref: "workspace",
			required: true,
		},
		status: {
			type: String,
			enum: ["Planning", "In Progress", "On Hold", "Completed", "Cancelled"],
		},
		startDate: { type: Date },
		dueDate: { type: Date },
		progress: { type: Number, min: 0, max: 100, default: 0 },
		tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
		members: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: "User",
				},
				role: {
					type: String,
					enum: ["manager", "contributor", "viewer"],
					default: "contributor",
				},
			},
		],
		tags: [{ type: String }],
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		isArchived: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const Project = model("Project", projectSchema);
export default Project;
