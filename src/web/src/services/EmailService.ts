export async function sendEmail(userId: number, type: string, name: string, email: string, newEmail?: string): Promise<void> {
    let html: string = "";
    let subject: string = "";
    const token: string = getToken();
    let link: string = "";

    if (type === "changeEmailNew") {
        link = `http://localhost:3000/bevestigWijziging?token=${token}`;
        subject = "Bevestiging emailwijziging Starshop";
        html = "<h1>Goededag!</h1>" +
        "<p>Dit is een confirmatie dat u uw email heeft gewijzigd van Starshop. " +
        "Om dit te bevestigen, klik op deze link: <br><br>" + link +
        " <br><br>Heeft u dit niet gedaan of wilt u dit annuleren? Dan kunt u deze email negeren.";
    }

    if (type === "changeEmailOld" && newEmail) {
        link = `http://localhost:3000/annuleerWijziging?token=${token}`;
        subject = "Bevestiging emailwijziging Starshop";
        html = "<h1>Goededag!</h1>" +
        "Dit is een bevestiging dat u uw email heeft gewijzigd naar: " + newEmail +
        " <br><br>Als u dit niet bent, klik op deze link om de wijziging te annuleren: " + link + ".";
    }

    await saveToken(token, userId, email);

    const response: Response = await fetch("https://api.hbo-ict.cloud/mail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer pb4sef2425_naagooxeekuu77.h6itSLok4uSdXIdG",
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
            subject: subject,
            html: html,
        }),
    });

    const data: unknown = await response.json();
    console.log("Response:", data);
};

export function getToken(): string {
    const token: string = btoa(`${Date.now()}-${Math.random()}`);
    return token;
}

export async function saveToken(token: string, userId: number, email: string): Promise<void> {
    try {
        const response: Response = await fetch("http://localhost:3001/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ token, userId, email }),
        });

        if (!response.ok) {
            console.error(`Error saving token: ${token}:`, response.statusText);
            return;
        }

        return;
    }
    catch (error: unknown) {
        console.error("Token opslaan is mislukt door: ", error);
    }
}
