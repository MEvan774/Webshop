import { UserRegisterData } from "@shared/types";
import { IRegisterService } from "@web/interfaces/IRegisterService";
import { EmailService } from "@web/services/EmailService";

/**
 * Here all register-logic is placed
 */
export class RegisterService implements IRegisterService {
    /**
     * Checks if all data is present and in correct format
     * @param fname Firstname field
     * @param lname Lastname field
     * @param email Email field
     * @param gender Gender field
     * @param dob DoB field
     * @param password Password field
     * @param passwordRepeat Password verify field
     */
    public checkData(fname: string, lname: string, email: string, gender: string, dob: string, password: string, passwordRepeat: string): { valid: boolean; messages: string[] } {
        const messages: string[] = [];
        if (!fname.trim()) {
            messages.push("Voer uw voornaam in...");
        }
        if (!lname.trim()) {
            messages.push("Voer uw achternaam in...");
        }
        if (!email.trim() || !email.includes("@")) {
            messages.push("Voer een geldig emailadres in...");
        }
        if (!gender.trim()) {
            messages.push("Selecteer uw geslacht...");
        }
        if (!dob.trim()) {
            messages.push("Voer uw geboortedatum in...");
        }
        if (!password) {
            messages.push("Voer een wachtwoord in...");
        }
        else if (password.length < 6) {
            messages.push("Uw wachtwoord moet minstens 6 karakters bevatten...");
        }
        if (password !== passwordRepeat) {
            messages.push("De wachtwoorden komen niet overeen!");
        }
        return { valid: messages.length === 0, messages };
    }

    /**
     * Check whether an email exists in the system
     * @param email Requires an email address
     * @returns true or false to determine if an email is used already
     */
    public async getUserByEmail(email: string): Promise<boolean> {
        try {
            const response: Response = await fetch(`${VITE_API_URL}user/exists?email=${encodeURIComponent(email)}`, {
                method: "GET",
                credentials: "include",
            });

            if (response.status === 200) {
                console.log("De gebruiker bestaat");
                return true;
            }

            if (response.status === 404) {
                console.log("De gebruiker bestaat niet");
                return false;
            }

            throw new Error(`Onverwachte statuscode: ${response.status}`);
        }
        catch (error) {
            console.log("Bestaande gebruiker zoeken is mislukt:", error);
            return false;
        }
    }

    /**
     * This function actually registers a user into the system after all other checks are completed
     * @param fname Firstname field
     * @param lname Lastname field
     * @param email Email field
     * @param gender Gender field
     * @param dob DoB field
     * @param password Password field
     * @returns true or false based off success
     */
    public async registerUser(fname: string, lname: string, email: string, dob: string, gender: string, password: string): Promise<boolean> {
        const userData: UserRegisterData = { firstname: fname, lastname: lname, email, dob, gender, password };
        const emailService: EmailService = new EmailService();
        try {
            // Requires the route to navigate from Front-End to Backend
            const response: Response = await fetch(`${VITE_API_URL}user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                // Sets the data into JSON format for the post-call to the server
                body: JSON.stringify(userData),
            });
            // Return error if response is not OK
            if (response.status === 200) {
                console.log("De gebruiker bestaat");
                return true;
            }
            // All OK: Account has been made
            console.log("Account succesvol aangemaakt!");
            await emailService.sendEmail(
                fname,
                email,
                "Welkom bij Starshop",
                `<h1>Welkom ${fname}!</h1>, <p>Bedankt voor het registreren bij Starshop.</p>`
            );
            return true;
        }
        // Search for errors and provide details (such as code 500: server issue)
        catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Registratie mislukt:", error.message);
            }
            else {
                console.error("Registratie mislukt, onbekende fout:", error);
            }
            return false;
        }
    }
}
