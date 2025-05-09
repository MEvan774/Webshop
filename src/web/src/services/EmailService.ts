export async function sendEmail(type: string, name: string, email: string, newEmail?: string): Promise<void> {
    let html: string = "";
    let subject: string = "";

    if (type === "changeEmailNew") {
        subject = "Bevestiging emailwijziging Starshop";
        html = "<h1>Goededag!</h1>" +
        "<p>Dit is een confirmatie dat u uw email heeft gewijzigd van Starshop. " +
        "Om dit te bevestigen, klik op deze link: <br><br>" +
        "Heeft u dit niet gedaan of wilt u dit annuleren? Dan kunt u deze email negeren.";
    }

    if (type === "changeEmailOld" && newEmail) {
        subject = "Bevestiging emailwijziging Starshop";
        html = "<h1>Goededag!</h1>" +
        "Dit is een bevestiging dat u uw email heeft gewijzigd naar: " + newEmail +
        ".<br><br>Als u dit niet bent, klik op deze link om de wijziging te annuleren: ";
    }

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
