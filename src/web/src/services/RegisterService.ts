import { UserResult, UserRegisterData } from "@shared/types";
import { IRegisterService } from "@web/interfaces/IRegisterService";

export class RegisterService implements IRegisterService {
    // Haal alle gebruikers op
    public async getAllUsers(): Promise<UserResult[]> {
        const response: Response = await fetch(`${VITE_API_URL}user`, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const users: UserResult[] = await response.json() as unknown as UserResult[];
        return users;
    }

    // Tijdelijk debuggen in RegisterService.testQuery:
    public async testQuery(): Promise<number | undefined> {
        const response: Response = await fetch(`${VITE_API_URL}user`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            const errorText: string = await response.text(); // Voegt foutbericht toe voor debugging
            throw new Error(`Failed to fetch user. Status: ${response.status}, Message: ${errorText}`);
        }

        const userResult: UserResult[] = await response.json() as unknown as UserResult[];
        return userResult[0]?.userId; // retourneert de userId van de eerste gebruiker
    }

    public async onClickRegister(
        fname: string,
        lname: string,
        email: string,
        dob: string,
        gender: string,
        password: string,
        passwordRepeat: string
    ): Promise<boolean> {
        // Validatie
        if (!fname || !lname || !email || !dob || !gender || !password || !passwordRepeat) {
            console.error("Alle velden zijn verplicht.");
            return false;
        }

        if (password !== passwordRepeat) {
            console.error("Wachtwoorden komen niet overeen.");
            return false;
        }

        const userData: UserRegisterData = { firstname: fname, lastname: lname, email, dob, gender, password };
        try {
            const response: Response = await fetch(`${VITE_API_URL}user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Zorg ervoor dat we JSON verzenden
                },
                credentials: "include", // Zorg ervoor dat we ook de sessie/cookie meesturen indien nodig
                body: JSON.stringify(userData), // Stuur de gebruikersgegevens als JSON
            });

            if (!response.ok) {
                const errorText: string = await response.text();
                throw new Error(`Failed to create user. Status: ${response.status}, Message: ${errorText}`);
            }

            console.log("Account succesvol aangemaakt!");
            return true;
        }
        catch (error) {
            console.error("Registratie mislukt:", error);
            return false;
        }
    }
}
