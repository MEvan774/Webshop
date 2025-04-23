import { LoginData, SessionResponse } from "@shared/types";
import { ILoginService } from "@web/interfaces/ILoginService";

/**
 * Here all login-logic is placed
 */
export class LoginService implements ILoginService {
    public checkData(email: string, password: string): { valid: boolean; message?: string } {
        if (!email.trim()) {
            return { valid: false, message: "Voer een email in" };
        }
        if (!password.trim()) {
            return { valid: false, message: "Voer een wachtwoord in" };
        }
        return { valid: true };
    }

    public async loginUser(email: string, password: string): Promise<void> {
        const loginData: LoginData = { email, password };
        try {
            const response: Response = await fetch(`${VITE_API_URL}user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const errorText: string = await response.text();
                throw new Error(`Failed to log in. Status: ${response.status}, Message: ${errorText}`);
            }

            const sessionResponse: Response = await fetch(`${VITE_API_URL}session`, {
                credentials: "include", // cookie van login wordt meegegeven
            });

            if (!sessionResponse.ok) {
                throw new Error("Kon sessie niet ophalen.");
            }

            const sessionData: SessionResponse = await sessionResponse.json() as SessionResponse;
            // sessionStorage.setItem("sessionData", JSON.stringify(sessionData.sessionId));
            console.log("Ingelogd met sessie-ID:", sessionData.sessionId);

            // ➡️ Hier kan je redirecten, state bijwerken, etc.
            // Bijvoorbeeld:
            // window.location.href = "/dashboard";
        }
        catch (error) {
            console.error("Login mislukt:", error);
            throw error;
        }
    }
}
