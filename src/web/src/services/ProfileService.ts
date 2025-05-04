import { UserResult } from "@shared/types";

export async function getUser(): Promise<UserResult | null> {
    const sessionID: string = sessionStorage.getItem("sessionData") || "0";

    if (sessionID === "0") {
        console.error("No session ID found.");
        return null;
    }

    const response: Response = await fetch(`http://localhost:3001/user/${sessionID}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        console.error(`Error fetching game with ID ${sessionID}:`, response.statusText);
        return null;
    }

    const userData: UserResult = await response.json() as UserResult;
    return userData;
}

export async function changePassword(userID: number, newPassword: string): Promise<void> {
    try {
        const response: Response = await fetch("http://localhost:3001/user/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ userID, newPassword }),
        });

        if (!response.ok) {
            const error: string = await response.text();
            console.error("Failed to change password:", error);
            return;
        }
    }
    catch (error: unknown) {
        console.error("Wachtwoord veranderen is mislukt door: ", error);
    }
}
