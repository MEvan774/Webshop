import { GameResult, LicenseResult, UserEditData, UserResponse, UserResult } from "@shared/types";
import bcrypt from "bcryptjs";
import { EmailService } from "./EmailService";

export class ProfileService {
    /**
     * Get the user with the sessionID
     *
     * @returns User as UserResult, or null when no user is found
     */
    public async getUser(): Promise<UserResult | null> {
        const response: Response = await fetch("http://localhost:3001/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            console.error("Error fetching the user:", response.statusText);
            return null;
        }

        const data: UserResponse = await response.json() as UserResponse;
        const userData: UserResult = data.user;
        console.log(userData);
        return userData;
    }

    /**
     * Change the password
     *
     * @param userID UserID of the user as number
     * @param newPassword The new password of the user as string
     * @returns Void
     */
    public async changePassword(userID: number, newPassword: string): Promise<void> {
        const password: string = await bcrypt.hash(newPassword, 10);

        try {
            const response: Response = await fetch("http://localhost:3001/user/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ userID, password }),
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
    public async saveEditProfile(
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
     * Format the dob as a Dutch date
     *
     * @param dateString The dob as a string
     * @returns The dob as a Dutch date as string
     */
    public formatDate(dateString: string): string {
        const date: Date = new Date(dateString);

        return date.toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    /**
     * Change the gender to the Dutch name
     *
     * @param gender Gender in English as string
     * @returns Gender in Dutch as string
     */
    public getGender(gender: string): string {
        if (gender === "female") return "Vrouw";

        if (gender === "male") return "Man";

        if (gender === "non-binary") return "Non-binair";

        return "Anders/onbekend";
    }

    /**
     * Create a select list for the email that starts at the current gender of the user
     *
     * @param user User as UserResult
     * @returns The string with the HTML for the select list
     */
    public getGenderSelect(user: UserResult): string {
        type Option = {
            value: string;
            label: string;
        };

        const genderOptions: Option[] = [
            { value: "female", label: "Vrouw" },
            { value: "male", label: "Man" },
            { value: "non-binary", label: "Non-Binary" },
            { value: "other", label: "Anders" },
            { value: "Prefer not to answer", label: "Liever geen antwoord" },
        ];

        const genderSelect: string = `
            <select id="genderEdit" name="gender" class="gender">
                ${genderOptions.map(option => `
                    <option value="${option.value}" ${option.value === user.gender ? "selected" : ""}>
                        ${option.label}
                    </option>
                `).join("")}
            </select>
        `;

        return genderSelect;
    }

    /**
     * Creates the HTML for the owned games of the user
     *
     * @param userId The userId of the user as number
     * @returns String with the HTML for the games
     */
    public async createGamesHTML(userId: number): Promise<string> {
        let html: string = "<h2>Geen spellen gevonden. Koop een spel om hier uw spellen te zien!</h2>";
        const games: GameResult[] | undefined = await this.getLicensesByUserId(userId);

        if (!games) {
            return html;
        }
        else {
            html = "";
        }

        for (let x: number = 0; x < games.length; x++) {
            html += `
            <div id='game${x}' class='gameProfileClass'>
                <img src='${games[x].thumbnail}' class='gameProfileThumbnail'>
                <div class='gameProfileText'>
                    <p class='gameProfileTitle'>${games[x].title}</p>
                    <a class='gamesProfileButton' href='${games[x].url}' target="_blank" rel="noopener">Speel nu!</a>
                </div>
            </div>
            `;
        }

        return html;
    }

    /**
     * Gets the licenses of the games the user owns
     *
     * @param userId The userId of the user as number
     * @returns GameResult[] with owned games, or undefined if no games are owned
     */
    private async getLicensesByUserId(userId: number): Promise<GameResult[] | undefined> {
        const response: Response = await fetch(`http://localhost:3001/license/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            return;
        }

        const licenseData: LicenseResult[] = await response.json() as LicenseResult[];

        const games: GameResult[] = [];

        for (let x: number = 0; x < licenseData.length; x++) {
            const gameFound: GameResult | undefined = await this.getGamesBySKU(licenseData[x].SKU);

            if (gameFound) {
                games.push(gameFound);
            }
        }

        return games;
    }

    /**
     * Gets the game with the SKU
     *
     * @param SKU The SKU of the game as string
     * @returns GameResult with the game, or undefined if no game is found
     */
    private async getGamesBySKU(SKU: string): Promise<GameResult | undefined> {
        const response: Response = await fetch(`http://localhost:3001/gamesSKU/${SKU}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            console.error(`Error fetching game with ID ${SKU}:`, response.statusText);
            return;
        }

        const gamesData: GameResult = await response.json() as GameResult;

        return gamesData;
    }

    public async writeEmail(kind: string, name: string, email: string, userId: number, newEmail?: string): Promise<void> {
        const _emailService: EmailService = new EmailService();

        const token: string = this.getToken();

        await this.saveToken(token, userId, email, kind);

        let subject: string = "";
        let html: string = "";

        if (kind === "new") {
            const link: string = `http://localhost:3000/bevestigWijziging?token=${token}`;

            subject = "Bevestiging emailwijziging Starshop";
            html = "<h1>Goededag!</h1>" +
            "<p>Dit is een confirmatie dat u uw email heeft gewijzigd van Starshop. " +
            "Om dit te bevestigen, klik op deze link: <br><br>" + link +
            " <br><br>Heeft u dit niet gedaan of wilt u dit annuleren? Dan kunt u deze email negeren.";

            await _emailService.sendEmail(name, email, subject, html);
        }
        else if (kind === "old" && newEmail) {
            const link: string = `http://localhost:3000/annuleerWijziging?token=${token}`;

            subject = "Bevestiging emailwijziging Starshop";
            html = "<h1>Goededag!</h1>" +
            "Dit is een bevestiging dat u uw email heeft gewijzigd naar: " + newEmail +
            " <br><br>Als u dit niet bent, klik op deze link om de wijziging te annuleren: " + link + ".";

            await _emailService.sendEmail(name, email, subject, html);
        }

        return;
    }

    /**
    * Generate a token for the confirmation
    *
    * @returns The new token as a string
    */
    private getToken(): string {
        const token: string = btoa(`${Date.now()}-${Math.random()}`);
        return token;
    }

    /**
     * Save the token to the database and links the userId and email to it
     *
     * @param token The generated token as a string
     * @param userId The userId of the user as a number
     * @param email The email of the user as a string
     * @returns Void
     */
    private async saveToken(token: string, userId: number, email: string, type: string): Promise<void> {
        try {
            const response: Response = await fetch("http://localhost:3001/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ token, userId, email, type }),
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
}
