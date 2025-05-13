import { UserEditData, UserResult } from "@shared/types";

/**
 * Get the user with the sessionID
 *
 * @returns User as UserResult, or null when no user is found
 */
export async function getUser(): Promise<UserResult | null> {
    // Get sessionID from the sessionStorage
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

/**
 * Change the password
 *
 * @param userID UserID of the user as number
 * @param newPassword The new password of the user as string
 * @returns Void
 */
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

/**
 * Save the changes to the user information in the profile
 *
 * @param userId UserId of the user as number
 * @param fname New or unchanged first name of the user as string
 * @param lname New or unchanged last name of the user as string
 * @param dob New or unchanged date of birth of the user as string
 * @param gender New or unchanged gender of the user as string
 * @param countryString New or unchanged country of the user as string, can be empty when no country is filled in
 * @returns Boolean if changes are saved correctly
 */
export async function saveEditProfile(
    userId: number, fname: string, lname: string, dob: string, gender: string, countryString?: string
): Promise<boolean> {
    const country: string = countryString ?? "";

    const userData: UserEditData = { userId, fname, lname, dob, gender, country };

    try {
        const response: Response = await fetch("http://localhost:3001/user/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            return false;
        }

        await response.json() as string;
        return true;
    }
    catch (error: unknown) {
        console.error(error);
        return false;
    }
}

/**
 * Checks if email is in used when changing the email
 *
 * @param email Email that gets checked as string
 * @returns Boolean whether email is free
 */
export async function isEmailUsed(email: string): Promise<boolean> {
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
