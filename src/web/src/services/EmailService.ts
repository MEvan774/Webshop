import { IEmailService } from "@web/interfaces/IEmailService";

export class EmailService implements IEmailService {
    public async sendEmail(name: string, email: string, subject: string, htmlBody: string): Promise<void> {
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
        console.log("Response:", data);
    };
}
