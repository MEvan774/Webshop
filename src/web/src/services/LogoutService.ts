import { ILogoutService } from "@web/interfaces/ILogoutService";

/**
 * Service voor het uitloggen
 */
export class LogoutService implements ILogoutService {
    public async logoutUser(sessionID: string): Promise<void> {
        try {
            const response: Response = await fetch(`${VITE_API_URL}user/logout`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ sessionId: sessionID }),
            });

            if (!response.ok) {
                const errorText: string = await response.text();
                throw new Error(`Uitloggen mislukt. Status: ${response.status}, Message: ${errorText}`);
            }

            console.log("Uitloggen succesvol.");

            window.location.href = "/login.html";
        }
        catch (error: unknown) {
            console.error("Fout bij uitloggen:", error); // Foutmelding loggen
            throw error;
        }
    }
}
