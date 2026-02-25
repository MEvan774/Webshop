import { Resend } from "resend";

export class EmailService {
    /**
     * Send an email using Resend
     *
     * @param to Recipient email address
     * @param toName Recipient name
     * @param subject Email subject
     * @param html HTML body of the email
     */
    public async sendEmail(to: string, toName: string, subject: string, html: string): Promise<boolean> {
        const resend: Resend = new Resend(process.env.RESEND_API_KEY);
        try {
            const { error } = await resend.emails.send({
                from: "Starshop <onboarding@resend.dev>",
                to: [`${toName} <${to}>`],
                subject: subject,
                html: html,
            });

            if (error) {
                console.error("Resend error:", error);
                return false;
            }

            console.log(`Verification email sent to ${to}`);
            return true;
        }
        catch (error: unknown) {
            console.error("Failed to send email:", error);
            return false;
        }
    }
}
