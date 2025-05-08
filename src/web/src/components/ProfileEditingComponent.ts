import { UserResult } from "@shared/types";
import { BaseProfileComponent } from "./BaseProfileComponent";
import { saveEditProfile } from "@web/services/ProfileService";

export class ProfileEditingComponent extends BaseProfileComponent {
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

    public async saveProfile(): Promise<void> {
        const user: UserResult | null = await this.getCurrentUser();
        if (!user) return;

        const errorMessagePlace: HTMLParagraphElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLParagraphElement>("#profileEditError");

        if (!errorMessagePlace) return;

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

        const fname: string | undefined = fnameInput?.value;
        const lname: string | undefined = lnameInput?.value;
        const dob: string | undefined = dobInput?.value;
        const gender: string | undefined = genderInput?.value;
        const country: string = countryInput?.value ?? "";

        if (!fname || !lname || !dob || !gender) {
            errorMessagePlace.innerHTML = "Alle velden naast locatie zijn verplicht";
            return;
        }

        if (fname === user.firstname && lname === user.lastname && dob === user.dob &&
          gender === user.gender && country === user.country) {
            if (window.confirm("U heeft niks veranderd, wilt u toch terug naar uw profiel?")) {
                this.dispatchEvent(new CustomEvent("to-profile", { bubbles: true }));
            }
            return;
        }

        if (window.confirm("Wilt u de veranderingen opslaan?")) {
            const isSaved: boolean = await saveEditProfile(user.userId, fname, lname, dob, gender, country);

            if (!isSaved) {
                errorMessagePlace.innerHTML =
                "Er is iets misgegaan met het wijzigen van uw gegevens, probeer later opnieuw.";
                return;
            }

            window.alert("Uw gegevens zijn gewijzigd.");
            this.dispatchEvent(new CustomEvent("to-profile", { bubbles: true }));
        }
    }

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
            <link rel="stylesheet" href="/assets/css/currentGame.css">
            <div id="profilePictureEditDiv">
                <img id="profilePicture" src="${profilePicture}" width="500px"><br>
                <button id="profilePictureEditButton">Profielfoto wijzigen</button>
            </div>

            <div>
                <label for="fname">Voornaam:</label>
                <input type="text" id="fnameEdit" name="fname" class="fname" value="${user.firstname}">
            </div>
            <div>
                <label for="lname">Achternaam:</label>
                <input type="text" id="lnameEdit" name="lname" class="lname" value="${user.lastname}">
            </div>
            <div>
                <label for="dob">Geboortedatum:</label>
                <input type="date" id="dobEdit" name="dob" class="${user.dob}" value="${user.dob}">
            </div>
            <div>
                <label for="gender">Geslacht:</label>
                ${genderSelect}
            </div>
            <div>
                <label for="country">Locatie:</label>
                <input type="text" id="countryEdit" name="country" class="country" ${country}">
            </div>
            
            <button id="changeEmailButton">Email wijzigen</button>
            <button id="changePasswordButton">Wachtwoord wijzigen</button>

            <button id="editSaveButton">Bewerking opslaan</button>

            <p id="profileEditError"></p>
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
