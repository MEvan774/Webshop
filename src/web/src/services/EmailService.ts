import { IEmailService } from "@web/interfaces/IEmailService";

export class EmailService implements IEmailService {
    /**
     * Send an email through the API (which uses Resend server-side)
     */
    public async sendVerifyEmail(name: string, email: string, subject: string, htmlBody: string): Promise<void> {
        try {
            const response: Response = await fetch(`${VITE_API_URL}email/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    to: email,
                    toName: name,
                    subject: subject,
                    html: htmlBody,
                }),
            });

            const data: unknown = await response.json();
            console.log("Email send result:", data);
        }
        catch (error) {
            console.error("Failed to send email:", error);
        }
    }

    /**
      * Checks if email is in used when changing the email
      *
      * @param email Email that gets checked as string
      * @returns Boolean whether email is free
    */
    public async isEmailUsed(email: string): Promise<boolean> {
        const response: Response = await fetch(`${VITE_API_URL}user/check-email/${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            return false;
        }

        const emailFree: boolean = await response.json() as boolean;
        return emailFree;
    }
}
