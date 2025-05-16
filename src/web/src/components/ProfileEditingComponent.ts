import { UserResult } from "@shared/types";
import { BaseProfileComponent } from "./BaseProfileComponent";
import { ProfileEditService } from "@web/services/ProfileEditService";

/**
 * Class for the profile editing page HTML, extends BaseProfileComponent
 */
export class ProfileEditingComponent extends BaseProfileComponent {
    private readonly profileEditService: ProfileEditService = new ProfileEditService();

    /**
     * Saves the profile edits tot the database
     *
     * @returns Void
     */
    public async saveProfile(): Promise<void> {
        const user: UserResult | null = await this.getCurrentUser();
        if (!user || !this.shadowRoot) return;

        if (await this.profileEditService.saveProfile(user, this.shadowRoot)) {
            this.dispatchEvent(new CustomEvent("to-profile", { bubbles: true }));
        }
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
        const genderSelect: string = this.profileEditService.getGenderSelect(user);
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
