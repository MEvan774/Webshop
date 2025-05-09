const params: URLSearchParams = new URLSearchParams(window.location.search);
const token: string | null = params.get("token");
const statusEl: HTMLElement | null = document.getElementById("status");

if (statusEl) {
    if (!token) {
        statusEl.textContent = "Geen token gevonden.";
    }
    else {
        try {
            const response: Response = await fetch(`http://localhost:3001/token/${token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                statusEl.innerHTML = "Token is not found.";
            }

            const userId: number = await response.json() as number;

            console.log(userId);

            if (typeof userId === "number" && !isNaN(userId)) {
                statusEl.innerHTML =
                "Token is validated! The email has been changed. Click <a href='/login.html'>here</a> to log in.";
            }
        }
        catch (error: unknown) {
            console.error("Token opslaan is mislukt door: ", error);
            statusEl.innerHTML = "Token is not found.";
        }
    }
}
