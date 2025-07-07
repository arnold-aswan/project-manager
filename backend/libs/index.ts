import ActivityLog from "../models/activity";

const logActivity = async (
	userId: string,
	action: string,
	resourceType: string,
	resourceId: string,
	details: any
) => {
	try {
		await ActivityLog.create({
			user: userId,
			action,
			resourceType,
			resourceId,
			details,
		});
	} catch (error) {
		console.log("Error logging activity:", error);
	}
};

export { logActivity };
