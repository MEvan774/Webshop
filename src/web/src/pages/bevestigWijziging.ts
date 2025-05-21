const params: URLSearchParams = new URLSearchParams(window.location.search);
const token: string | null = params.get("token");
const statusEl: HTMLElement | null = document.getElementById("status");
const bevestigKnop: HTMLElement | null = document.getElementById("emailConfirmButton");
const bevestigDiv: HTMLElement | null = document.getElementById("emailConfirmDiv");

// Interface for the token from the database
interface TokenData {
    email: string;
    userId: number;
    token: string;
}

if (statusEl && bevestigKnop && bevestigDiv) {
    bevestigKnop.addEventListener("click", async () => {
        if (!token) {
            statusEl.textContent = "Geen token gevonden.";
        }
        else {
            const tokenData: TokenData | boolean = await checkToken(token);

            if (typeof tokenData === "boolean") {
                statusEl.innerHTML = "Token is niet geldig.";
            }
            else {
                await changeEmail(tokenData.email, tokenData.userId);

                bevestigDiv.innerHTML = "";
                statusEl.innerHTML =
                "De email is gewijzigd! Klik <a href='/login.html'>hier</a> om in te loggen.";
            }
        }
    });
}

/**
 * Check whether the token exists in the database
 *
 * @param token Token to be checked as string
 * @returns The token as TokenData, or false when no token is found
 */
async function checkToken(token: string): Promise<TokenData | boolean> {
    try {
        const response: Response = await fetch(`https://naagooxeekuu77-pb4sef2425.hbo-ict.cloud/api/token/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            return false;
        }

        const tokenData: TokenData | undefined = await response.json() as TokenData | undefined;

        if (tokenData) {
            return tokenData;
        }

        return false;
    }
    catch (error: unknown) {
        console.error("Token opslaan is mislukt door: ", error);
        return false;
    }
}

/**
 * Send a request to the backend to change the users email
 *
 * @param email New email of the user as string
 * @param userId UserId of the user as number
 * @returns Void
 */
async function changeEmail(email: string, userId: number): Promise<void> {
    try {
        const response: Response = await fetch("https://naagooxeekuu77-pb4sef2425.hbo-ict.cloud/api/user/change-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ userId, email }),
        });

        if (!response.ok) {
            const error: string = await response.text();
            console.error("Failed to change email:", error);
            return;
        }
    }
    catch (error: unknown) {
        console.error("Email veranderen is mislukt door: ", error);
    }
}
