import { UserResult } from "@shared/types";
import { EmailService } from "./EmailService";
import bcrypt from "bcryptjs";
import { IProfileChangeEmailService } from "@web/interfaces/IProfileChangeEmailService";

export class ProfileChangeEmailService implements IProfileChangeEmailService {
    public readonly _emailService: EmailService = new EmailService();

    /**
     * Save the new email and check if the input is correct
     *
     * @returns Void
     */
    public async emailSave(user: UserResult, shadowRoot: ShadowRoot): Promise<boolean> {
        const name: string = user.firstname + " " + user.lastname;

        // Get input fields
        const emailInput: HTMLInputElement | null | undefined =
          shadowRoot.querySelector<HTMLInputElement>("#emailEdit");
        const passwordInput: HTMLInputElement | null | undefined =
          shadowRoot.querySelector<HTMLInputElement>("#passwordEmailEdit");

        // Get the place for error messages
        const errorMessagePlace: HTMLParagraphElement | null | undefined =
          shadowRoot.querySelector<HTMLParagraphElement>("#passwordEditError");

        // Get and trim the values of the email and password
        const email: string | undefined = emailInput?.value.trim();
        const password: string | undefined = passwordInput?.value.trim();

        if (!errorMessagePlace) return false;

        // Return if not all fields are filled in
        if (!email || !password) {
            errorMessagePlace.innerHTML = "Vul alle velden in om verder te gaan!";
            return false;
        }

        // Return if the old password is incorrect
        const matchPassword: boolean = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            errorMessagePlace.innerHTML = "Het oude wachtwoord is incorrect.";
            return false;
        }

        // Return if the new email is the same as the current email
        if (email === user.email) {
            errorMessagePlace.innerHTML = "Dit is je huidige email!";
            return false;
        }

        // Check if the email is free and return if not
        const emailFree: boolean = await this._emailService.isEmailUsed(email);

        if (!emailFree) {
            errorMessagePlace.innerHTML = "Deze email is al bezet!";
            return false;
        }

        // Confirm the change, and send the confirmation emails
        if (window.confirm("Weet u zeker dat u uw email wil veranderen?")) {
            window.alert("Bevestig de wijziging via de mail in uw mailbox");

            await this.writeEmail("old", name, user.email, user.userId, email);
            await this.writeEmail("new", name, email, user.userId);
            return true;
        }

        return false;
    }

    public async writeEmail(kind: string, name: string, email: string, userId: number, newEmail?: string): Promise<boolean> {
        const token: string = this.getToken();

        await this.saveToken(token, userId, email, kind);

        let subject: string = "";
        let html: string = "";

        if (kind === "new") {
            const link: string = `http://localhost:3000/bevestigWijziging?token=${token}`;

            subject = "Bevestiging emailwijziging Starshop";
            html = "<h1>Goededag!</h1>" +
            "<p>Dit is een confirmatie dat u uw email heeft gewijzigd van Starshop. " +
            "Om dit te bevestigen, klik op deze link: <br><br>" + link +
            " <br><br>Heeft u dit niet gedaan of wilt u dit annuleren? Dan kunt u deze email negeren.";

            await this._emailService.sendEmail(name, email, subject, html);
        }
        else if (kind === "old" && newEmail) {
            const link: string = `http://localhost:3000/annuleerWijziging?token=${token}`;

            subject = "Bevestiging emailwijziging Starshop";
            html = "<h1>Goededag!</h1>" +
            "Dit is een bevestiging dat u uw email heeft gewijzigd naar: " + newEmail +
            " <br><br>Als u dit niet bent, klik op deze link om de wijziging te annuleren: " + link + ".";

            await this._emailService.sendEmail(name, email, subject, html);
        }

        return true;
    }

    /**
    * Generate a token for the confirmation
    *
    * @returns The new token as a string
    */
    public getToken(): string {
        const token: string = btoa(`${Date.now()}-${Math.random()}`);
        return token;
    }

    /**
     * Save the token to the database and links the userId and email to it
     *
     * @param token The generated token as a string
     * @param userId The userId of the user as a number
     * @param email The email of the user as a string
     * @returns Void
     */
    public async saveToken(token: string, userId: number, email: string, type: string): Promise<void> {
        try {
            const response: Response = await fetch("http://localhost:3001/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ token, userId, email, type }),
            });

            if (!response.ok) {
                console.error(`Error saving token: ${token}:`, response.statusText);
                return;
            }
            return;
        }
        catch (error: unknown) {
            console.error("Token opslaan is mislukt door: ", error);
        }
    }
}
