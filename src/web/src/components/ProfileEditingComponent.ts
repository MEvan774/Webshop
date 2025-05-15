import { UserResult } from "@shared/types";
import { BaseProfileComponent } from "./BaseProfileComponent";

/**
 * Class for the profile editing page HTML, extends BaseProfileComponent
 */
export class ProfileEditingComponent extends BaseProfileComponent {
    /**
     * Create a select list for the email that starts at the current gender of the user
     *
     * @param user User as UserResult
     * @returns The string with the HTML for the select list
     */
    private getGenderSelect(user: UserResult): string {
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
    public async saveProfile(): Promise<void> {
        const user: UserResult | null = await this.getCurrentUser();
        if (!user) return;

        // Get the place for error messages
        const errorMessagePlace: HTMLParagraphElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLParagraphElement>("#profileEditError");

        if (!errorMessagePlace) return;

        // Get the input fields
        const fnameInput: HTMLInputElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLInputElement>("#fnameEdit");
        const lnameInput: HTMLInputElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLInputElement>("#lnameEdit");
        const dobInput: HTMLInputElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLInputElement>("#dobEdit");
        const genderInput: HTMLSelectElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLSelectElement>("#genderEdit");
        const countryInput: HTMLInputElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLInputElement>("#countryEdit");

        // Get the values of the input fields
        const fname: string | undefined = fnameInput?.value;
        const lname: string | undefined = lnameInput?.value;
        const dob: string | undefined = dobInput?.value;
        const gender: string | undefined = genderInput?.value;
        const country: string = countryInput?.value ?? "";

        // Return if not all fields are filled in
        if (!fname || !lname || !dob || !gender) {
            errorMessagePlace.innerHTML = "Alle velden naast locatie zijn verplicht";
            return;
        }

        // Confirm not changing any of the information
        if (fname === user.firstname && lname === user.lastname && dob === user.dob &&
          gender === user.gender && country === user.country) {
            if (window.confirm("U heeft niks veranderd, wilt u toch terug naar uw profiel?")) {
                this.dispatchEvent(new CustomEvent("to-profile", { bubbles: true }));
            }
            return;
        }

        // Confirm the changes, and save the information
        if (window.confirm("Wilt u de veranderingen opslaan?")) {
            const isSaved: boolean = await this.ProfileService.saveEditProfile(user.userId, fname, lname, dob, gender, country);

            if (!isSaved) {
                errorMessagePlace.innerHTML =
                "Er is iets misgegaan met het wijzigen van uw gegevens, probeer later opnieuw.";
                return;
            }

            window.alert("Uw gegevens zijn gewijzigd.");
            this.dispatchEvent(new CustomEvent("to-profile", { bubbles: true }));
        }
    }

    /**
     * Change the profile picture, not implemented yet
     */
    public saveProfilePicture(): void {
        console.log("edit");
    }

    /**
     * Render the HTML of the edit profile page
     *
     * @returns Void
     */
    protected async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const user: UserResult | null = await this.getCurrentUser();

        if (!user) return;

        // Set variables
        const profilePicture: string = user.profilePicture ?? "/assets/images/userImage.png";
        const genderSelect: string = this.getGenderSelect(user);
        let country: string = "placeholder='Locatie'";

        if (user.country) {
            country = "value='" + user.country + "'";
        }

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/assets/css/profile.css">

            <div id="profileEditBox">
                    <img id="profilePicture" src="${profilePicture}" width="35%" height="35%"><br>

                <div id="profileForm">
                    <h1 id="profileFormTitle">Jouw gegevens:</h1>
                    <label for="fname">Voornaam: </label>
                    <label for="lname" id="lnameLabel">Achternaam:</label><br>
                    <input type="text" id="fnameEdit" name="fname" class="fname" value="${user.firstname}">
                    <input type="text" id="lnameEdit" name="lname" class="lname" value="${user.lastname}"><br>
                    <label for="dob">Geboortedatum:</label>
                    <label for="country">Locatie:</label><br>
                    <input type="date" id="dobEdit" name="dob" class="${user.dob}" value="${user.dob}">
                    <input type="text" id="countryEdit" name="country" class="country" ${country}"><br>
                    <label for="gender">Geslacht:</label><br>
                    ${genderSelect}<br>
                    
                    <button id="editSaveButton" class="editButton">Bewerking opslaan</button><br>
                    <button id="changeEmailButton" class="editButton">Email wijzigen</button>
                    <button id="changePasswordButton" class="editButton">Wachtwoord wijzigen</button><br>

                    <p id="profileEditError"></p>
                </div>
            </div>
            `;

        // Make an event for the changeEmailButton
        this.setButtonEvents("changeEmailButton", "change-email");

        // Make an event for the changePasswordButton
        this.setButtonEvents("changePasswordButton", "change-password");

        // Make an event for the editSaveButton
        this.setButtonEvents("editSaveButton", "save-profile", "saveProfile");
    }
}

window.customElements.define("webshop-profile-editing", ProfileEditingComponent);
