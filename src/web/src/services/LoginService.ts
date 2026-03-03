import { LoginData, SessionResponse } from "@shared/types";
import { ILoginService } from "@web/interfaces/ILoginService";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
const VITE_API_URL: string = (import.meta as any).env.VITE_API_URL as string;

/**
 * Here all login-logic is placed
 */
export class LoginService implements ILoginService {
    public checkData(email: string, password: string): { valid: boolean; message?: string } {
        if (!email.trim()) {
            return { valid: false, message: "Voer een e-mailadres in." };
        }
        if (!password.trim()) {
            return { valid: false, message: "Voer een wachtwoord in." };
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
                // Try to parse the JSON error body from the API
                // The backend sends { error: "Ongeldige inloggegevens." } etc.
                let errorMessage: string = "Inloggen mislukt. Probeer het opnieuw.";

                try {
                    const errorData: { error?: string } = await response.json() as { error?: string };

                    if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                }
                catch {
                    // If JSON parsing fails, use a generic message based on status
                    if (response.status === 401) {
                        errorMessage = "Onjuist e-mailadres of wachtwoord.";
                    }
                    else if (response.status === 403) {
                        errorMessage = "Je account is nog niet geverifieerd. Controleer je e-mail.";
                    }
                }

                throw new Error(errorMessage);
            }

            const sessionResponse: Response = await fetch(`${VITE_API_URL}session`, {
                credentials: "include",
            });

            if (!sessionResponse.ok) {
                throw new Error("Kon sessie niet ophalen.");
            }
            const sessionData: SessionResponse = await sessionResponse.json() as unknown as SessionResponse;
            console.log("Ingelogd met sessie-ID:", sessionData.sessionId);
        }
        catch (error) {
            console.error("Login mislukt:", error);
            throw error;
        }
    }
}
