import { UserEditData, UserResult } from "@shared/types";
import { IProfileEditService } from "@web/interfaces/IProfileEditService";

/**
 * Class for editing the profile, implements IProfileEditService
 */
export class ProfileEditService implements IProfileEditService {
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
     * Save the changes to the profile and check the inputs
     *
     * @returns Void
     */
    public async saveProfile(user: UserResult, shadowRoot: ShadowRoot): Promise<boolean> {
        // Get the place for error messages
        const errorMessagePlace: HTMLParagraphElement | null | undefined =
          shadowRoot.querySelector<HTMLParagraphElement>("#profileEditError");

        if (!errorMessagePlace) return false;

        // Get the input fields
        const fnameInput: HTMLInputElement | null | undefined =
          shadowRoot.querySelector<HTMLInputElement>("#fnameEdit");
        const lnameInput: HTMLInputElement | null | undefined =
          shadowRoot.querySelector<HTMLInputElement>("#lnameEdit");
        const dobInput: HTMLInputElement | null | undefined =
          shadowRoot.querySelector<HTMLInputElement>("#dobEdit");
        const genderInput: HTMLSelectElement | null | undefined =
          shadowRoot.querySelector<HTMLSelectElement>("#genderEdit");
        const countryInput: HTMLInputElement | null | undefined =
          shadowRoot.querySelector<HTMLInputElement>("#countryEdit");

        // Get the values of the input fields
        const fname: string | undefined = fnameInput?.value;
        const lname: string | undefined = lnameInput?.value;
        const dob: string | undefined = dobInput?.value;
        const gender: string | undefined = genderInput?.value;
        const country: string = countryInput?.value ?? "";

        // Return if not all fields are filled in
        if (!fname || !lname || !dob || !gender) {
            errorMessagePlace.innerHTML = "Alle velden naast locatie zijn verplicht";
            return false;
        }

        // Confirm not changing any of the information
        if (fname === user.firstname && lname === user.lastname && dob === user.dob &&
          gender === user.gender && country === user.country) {
            if (window.confirm("U heeft niks veranderd, wilt u toch terug naar uw profiel?")) {
                return true;
            }
            return false;
        }

        // Confirm the changes, and save the information
        if (window.confirm("Wilt u de veranderingen opslaan?")) {
            const isSaved: boolean = await this.saveEditProfile(user.userId, fname, lname, dob, gender, country);

            if (!isSaved) {
                errorMessagePlace.innerHTML =
                "Er is iets misgegaan met het wijzigen van uw gegevens, probeer later opnieuw.";
                return false;
            }

            window.alert("Uw gegevens zijn gewijzigd.");
            return true;
        }

        return false;
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
            const response: Response = await fetch(`${VITE_API_URL}user/edit`, {
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
}
