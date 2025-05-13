import { UserEditData, UserResult } from "@shared/types";

export class ProfileService {
    /**
     * Get the user with the sessionID
     *
     * @returns User as UserResult, or null when no user is found
     */
    public async getUser(): Promise<UserResult | null> {
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
    public async changePassword(userID: number, newPassword: string): Promise<void> {
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
}
