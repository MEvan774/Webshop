import { UserResult } from "@shared/types";
import { getUser } from "@web/services/ProfileService";

export class ProfileEditingComponent extends HTMLElement {
    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        await this.render();
    }

    private async getCurrentUser(): Promise<UserResult | null> {
        return await getUser();
    }

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

    private setButtonEvents(buttonID: string, eventName: string): void {
        const button: HTMLButtonElement | null | undefined =
            this.shadowRoot?.querySelector(`#${buttonID}`);

        if (button) {
            button.addEventListener("click", () => {
                this.dispatchEvent(new CustomEvent(eventName, { bubbles: true }));
            });
        }
    }

    private async render(): Promise<void> {
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
            <button id="changePasswordVButton">Wachtwoord wijzigen</button>

            <button id="editSaveButton">Bewerking opslaan</button>
        `;

        // Make an event for the changeEmailButton
        this.setButtonEvents("changeEmailButton", "change-email");

        // Make an event for the changePasswordButton
        this.setButtonEvents("changePasswordButton", "change-password");

        // Make an event for the editSaveButton
        this.setButtonEvents("editSaveButton", "save-profile");
    }
}

window.customElements.define("webshop-profile-editing", ProfileEditingComponent);
