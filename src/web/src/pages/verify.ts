window.addEventListener("DOMContentLoaded", async () => {
    const params: URLSearchParams = new URLSearchParams(window.location.search);
    const token: string | null = params.get("token");
    const statusEl: HTMLElement | null = document.getElementById("status");

    if (!token || !statusEl) {
        statusEl!.textContent = "Geen verificatietoken gevonden.";
        return;
    }

    try {
        const response: Response = await fetch(`http://localhost:3001/verify?token=${token}`);
        const data: { message?: string; error?: string } = await response.json() as { message?: string; error?: string };

        if (response.ok) {
            statusEl.textContent = "Je account is succesvol geverifieerd!";
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        }
        else {
            if (data.error === "Uw account is reeds geverifieerd.") {
                statusEl.textContent = "Uw account is reeds geverifieerd.";
            }
            else {
                statusEl.textContent = data.error || "Verificatie mislukt.";
            }
        }
    }
    catch (err) {
        statusEl.textContent = "Er is een fout opgetreden tijdens de verificatie.";
        console.error("Fetch error:", err);
    }
});
