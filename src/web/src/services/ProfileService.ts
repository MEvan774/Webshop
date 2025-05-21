import { UserResponse, UserResult } from "@shared/types";
import { IProfileService } from "@web/interfaces/IProfileService";

/**
 * Class for the profile, implements IProfileService
 */
export class ProfileService implements IProfileService {
    /**
     * Get the user with the sessionID
     *
     * @returns User as UserResult, or null when no user is found
     */
    public async getUser(): Promise<UserResult | null> {
        const response: Response = await fetch(`${VITE_API_URL}profile`, {
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
        return userData;
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
}
