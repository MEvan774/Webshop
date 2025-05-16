import { UserResult } from "@shared/types";
import { BaseProfileComponent } from "./BaseProfileComponent";
import { ProfileChangePasswordService } from "@web/services/ProfileChangePasswordService";

/**
 * Class for the Profile page when changing the password, extends BaseProfileComponent
 */
export class ProfilePasswordComponent extends BaseProfileComponent {
    private readonly profileChangePasswordService: ProfileChangePasswordService =
        new ProfileChangePasswordService();

    public async passwordSave(): Promise<void> {
        const user: UserResult | null = await this.getCurrentUser();
        if (!user || !this.shadowRoot) return;

        if (await this.profileChangePasswordService.passwordSave(user, this.shadowRoot)) {
            this.dispatchEvent(new CustomEvent("to-profile", { bubbles: true }));
        }
    }

    /**
     * Render the HTML of the edit password profile page
     *
     * @returns Void
     */
    protected async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const user: UserResult | null = await this.getCurrentUser();

        if (!user) return;

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/assets/css/profile.css">

            <div id="passwordDiv">
                <h1 id="passwordH">Wachtwoord wijzigen:</h1>

                <div class="emailInput">
                    <label for="oldPassword">Huidige wachtwoord:</label>
                    <input type="text" id="oldPassword" name="oldPassword" class="password">
                </div>

                <div class="emailInput">
                    <label for="newPassword">Nieuwe wachtwoord:</label>
                    <input type="text" id="passwordEdit" name="newPassword" class="password">
                </div>

                <div class="emailInput">
                    <label for="repeatPassword">Herhaal nieuw wachtwoord:</label>
                    <input type="text" id="passwordEditRepeat" name="repeatPassword" class="password">
                </div>

                <div id="emailButtonDiv">
                    <button id="changePasswordSaveButton" class="emailButton">Bevestig</button>
                    <button id="changePasswordCancelButton" class="emailButton">Annuleer wijziging</button>
                </div>

                <p id="passwordEditError" class="profileError"></p>
            </div>
        `;

        // Make an event for the changePasswordSaveButton
        this.setButtonEvents("changePasswordSaveButton", "save-password", "passwordSave");

        // Make an event for the changePasswordCancelButton
        this.setButtonEvents("changePasswordCancelButton", "to-profile");
    }
}

window.customElements.define("webshop-profile-password", ProfilePasswordComponent);
