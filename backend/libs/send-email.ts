import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
	const { data, error } = await resend.emails.send({
		from: `TaskHub2 <onboarding@resend.dev>`,
		to,
		subject,
		html,
	});
	if (error) {
		console.log("error sending resend verification email");
		console.error({ error });
		return false;
	}

	console.log({ data });
	return true;
};
