import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const fromEmail = process.env.SENDER_EMAIL;

const sendEmail = async (to: string, subject: string, html: string) => {
	const msg = {
		to,
		from: `TaskHub <${fromEmail}>`,
		subject,
		html,
	};
	try {
		await sgMail.send(msg);
		return true;
	} catch (error) {
		console.error("Error sending email:", error);
		return false;
	}
};

export default sendEmail;
