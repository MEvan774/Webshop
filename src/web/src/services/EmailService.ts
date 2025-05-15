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

/**
    * Send an email to the user
    * *

* @param userId UserID of the user as number
  * @param type Type of email to send as string (changeEmail new for changing the email for example)
  * @param name First and last name of the user as string
  * @param email Email to send the mail to as string
  * @param newEmail New email as string, for sending a mail to the old email when changing the email,
  * and telling what the new email is
  */
// public async sendEmail(userId: number, type: string, name: string, email: string, newEmail?: string): Promise<void> {
// // Set variables
//     let html: string = "";
//     let subject: string = "";
//     const token: string = this.getToken();
//     let link: string = "";

//     // When changing the email, writes the email to the new emailaddress
//     if (type === "changeEmailNew") {
//         link = `http://localhost:3000/bevestigWijziging?token=${token}`;
//         subject = "Bevestiging emailwijziging Starshop";
//         html = "<h1>Goededag!</h1>" +
//         "<p>Dit is een confirmatie dat u uw email heeft gewijzigd van Starshop. " +
//         "Om dit te bevestigen, klik op deze link: <br><br>" + link +
//         " <br><br>Heeft u dit niet gedaan of wilt u dit annuleren? Dan kunt u deze email negeren.";
//     }

//     // When changing the email, writes the email to the old emailaddress
//     if (type === "changeEmailOld" && newEmail) {
//         link = `http://localhost:3000/annuleerWijziging?token=${token}`;
//         subject = "Bevestiging emailwijziging Starshop";
//         html = "<h1>Goededag!</h1>" +
//         "Dit is een bevestiging dat u uw email heeft gewijzigd naar: " + newEmail +
//         " <br><br>Als u dit niet bent, klik op deze link om de wijziging te annuleren: " + link + ".";
//     }

//     // Save confirmation token in the database
//     await this.saveToken(token, userId, email);

/**
* Generate a token for the confirmation
*
* @returns The new token as a string
*/
//  private getToken(): string {
//                 const token: string = btoa(`${Date.now()}-${Math.random()}`);
//                 return token;
//             }

//             /**
//              * Save the token to the database and links the userId and email to it
//              *
//              * @param token The generated token as a string
//              * @param userId The userId of the user as a number
//              * @param email The email of the user as a string
//              * @returns Void
//              */
//             private async saveToken(token: string, userId: number, email: string): Promise<void> {
//                 try {
//                     const response: Response = await fetch("http://localhost:3001/token", {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json",
//                         },
//                         credentials: "include",
//                         body: JSON.stringify({ token, userId, email }),
//                     });

//                     if (!response.ok) {
//                         console.error(`Error saving token: ${token}:`, response.statusText);
//                         return;
//                     }

//                     return;
//                 }
//                 catch (error: unknown) {
//                     console.error("Token opslaan is mislukt door: ", error);
//                 }
//             }
