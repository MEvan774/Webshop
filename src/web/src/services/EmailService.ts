import { IEmailService } from "@web/interfaces/IEmailService";

export class EmailService implements IEmailService {
    public async sendVerifyEmail(name: string, email: string, subject: string, htmlBody: string): Promise<void> {
        const response: Response = await fetch("https://api.hbo-ict.cloud/mail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer pb4sef2425_naagooxeekuu77.h6itSLok4uSdXIdG",
            },
            body: JSON.stringify({
                from: {
                    name: "Starshop",
                    address: "group@fys.cloud",
                },
                to: [
                    {
                        name: name,
                        address: email,
                    },
                ],
                subject: subject,
                html: htmlBody,
            }),
        });

        const data: unknown = await response.json();
        console.log(data);
        return;
    };

    /**
      * Checks if email is in used when changing the email
      *
      * @param email Email that gets checked as string
      * @returns Boolean whether email is free
    */
    public async isEmailUsed(email: string): Promise<boolean> {
        const response: Response = await fetch(`http://localhost:3001/user/check-email/${email}`, {
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
