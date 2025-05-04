import { UserResult } from "@shared/types";

export async function getUser(): Promise<UserResult | null> {
    const sessionID: string = sessionStorage.getItem("sessionData") || "0";

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
