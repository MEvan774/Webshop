import { UserRegisterData } from "@shared/types";
import { IRegisterService } from "@web/interfaces/IRegisterService";

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
    public checkData(fname: string, lname: string, email: string, gender: string, dob: string, password: string, passwordRepeat: string): { valid: boolean; message?: string } {
        if (!fname.trim()) {
            return { valid: false, message: "Voer uw voornaam in..." };
        }
        if (!lname.trim()) {
            return { valid: false, message: "Voer uw achternaam in..." };
        }
        if (!email.trim() || !email.includes("@")) {
            return { valid: false, message: "Voer een geldig emailadres in..." };
        }
        if (!gender.trim()) {
            return { valid: false, message: "Selecteer uw geslacht...." };
        }
        if (!dob.trim()) {
            return { valid: false, message: "Voer uw geboortedatum in..." };
        }
        if (!password) {
            return { valid: false, message: "Voer een wachtwoord in..." };
        }
        if (password.length < 6) {
            return { valid: false, message: "Uw wachtwoord moet minstens 6 karakters bevatten..." };
        }
        if (password !== passwordRepeat) {
            return { valid: false, message: "De wachtwoorden komen niet overeen!" };
        }

        return { valid: true };
    }

    public async registerUser(fname: string, lname: string, email: string, dob: string, gender: string, password: string): Promise<boolean> {
        const userData: UserRegisterData = { firstname: fname, lastname: lname, email, dob, gender, password };

        try {
            const response: Response = await fetch(`${VITE_API_URL}user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorText: string = await response.text();
                throw new Error(`Failed to create user. Status: ${response.status}, Message: ${errorText}`);
            }

            console.log("Account succesvol aangemaakt!");
            return true;
        }
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
