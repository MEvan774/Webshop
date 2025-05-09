import { UserEditData, UserResult } from "@shared/types";

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

export async function sendEmail(name: string, email: string): Promise<void> {
    const response: Response = await fetch("https://api.hbo-ict.cloud/mail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "pb4sef2425_naagooxeekuu77.h6itSLok4uSdXIdG",
        },
        body: JSON.stringify({
            from: {
                name: "Starshop",
                address: "anne.bakker3@hva.nl",
            },
            to: [
                {
                    name: name,
                    address: email,
                },
            ],
            subject: "Just a test!",
            html: `<h1>Goededag!</h1><p>Dit is een confirmatie dat u uw email heeft gewijzigd naar: ${email}. Als dit klopt, klik op deze link: </p>`,
        }),
    });

    const data: unknown = await response.json();
    console.log("Response:", data);
};
