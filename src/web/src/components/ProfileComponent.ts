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

        // Set variables
        const profilePicture: string = user.profilePicture ?? "/assets/images/userImage.png";
        const name: string = user.firstname + " " + user.lastname;
        const date: string = this.ProfileService.formatDate(user.dob);
        const country: string = user.country ?? "Locatie onbekend";
        const gender: string = this.ProfileService.getGender(user.gender);

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/assets/css/currentGame.css">
            <img id="profilePicture" src="${profilePicture}" width="500px"><br>

            <div id="profileDiv">
                <h1>${name}</h1>
                <p>${date}</p>
                <p>${country}</p>
                <p>${gender}</p>
                <button id="editButton">Profiel bewerken</button>
            </div>

            <h1>Gekochte spellen:</h1>
        `;

        // Make an event for the changeEmailCancelButton
        this.setButtonEvents("editButton", "edit-profile");
    }
}

window.customElements.define("webshop-profile", ProfileComponent);
