import { UserResult } from "@shared/types";
import { BaseProfileComponent } from "./BaseProfileComponent";

/**
 * Class for the normal profile page, extends BaseProfileComponent
 */
export class ProfileComponent extends BaseProfileComponent {
    /**
     * Render the HTML of the profile page
     *
     * @returns Void
     */
    protected async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const user: UserResult | null = await this.getCurrentUser();

        if (!user) return;

        const gamesHTML: string = await this.ProfileService.createGamesHTML(user.userId);

        // Set variables
        const profilePicture: string = user.profilePicture ?? "/assets/images/userImage.png";
        const name: string = user.firstname + " " + user.lastname;
        const date: string = this.ProfileService.formatDate(user.dob);
        const country: string = user.country ?? "Locatie onbekend";
        const gender: string = this.ProfileService.getGender(user.gender);

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/assets/css/profile.css">

            <div class="main-content">
                <div class="pictureDiv">
                    <img class="profilePictureProfile" src="${profilePicture}" width="35%"><br>

                    <div id="profileDiv">
                        <h1 id="profileNamePlace">${name}</h1>
                        <p id="profileDatePlace" class="profileText">${date}</p>
                        <p id="profileCountryPlace" class="profileText">${country}</p>
                        <p id="profileGenderPlace" class="profileText">${gender}</p>
                        <button id="editButton" class="profileButton">Profiel bewerken</button>
                    </div>
                </div>

                <h1 id="boughtGamesPlace">Gekochte spellen:</h1>
                <div id="gamesContainer">
                    ${gamesHTML}
                </div>
            </div>
        `;

        // Make an event for the changeEmailCancelButton
        this.setButtonEvents("editButton", "edit-profile");
    }
}

window.customElements.define("webshop-profile", ProfileComponent);
