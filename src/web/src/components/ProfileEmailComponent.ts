import { UserResult } from "@shared/types";
import { BaseProfileComponent } from "./BaseProfileComponent";
import { ProfileChangeEmailService } from "@web/services/ProfileChangeEmailService";

/**
 * Class for the edit email profile page, extends BaseProfileCompon ent
 */
export class ProfileEmailComponent extends BaseProfileComponent {
    private readonly profileChangeEmailService: ProfileChangeEmailService =
        new ProfileChangeEmailService();

    /**
     * If the email is saved, go to profile. Else, give the error message
     *
     * @returns Void
     */
    public async emailSave(): Promise<void> {
        const user: UserResult | null = await this.getCurrentUser();
        if (!user || !this.shadowRoot) return;

        if (await this.profileChangeEmailService.emailSave(user, this.shadowRoot)) {
            this.dispatchEvent(new CustomEvent("to-profile", { bubbles: true }));
        }
    }

    /**
     * Render the profile email edit page HTML
     *
     * @returns Void
     */
    protected async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        await this.getCurrentUser();

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/assets/css/profile.css">
            <div id="emailWarning">
                <h1 id="emailH">Email wijzigen:</h1>
                Bij het wijzigen van uw email wordt er een bevestiging naar het nieuwe emailadres gestuurd.<br>
                De email wordt pas gewijzigd als deze bevestigd is.<br>
                Ook wordt er een waarschuwing naar het oude emailadres gestuurd.<br>
                Vul hieronder de nieuwe email en uw huidige wachtwoord in,<br>
                of annuleer als u toch niet uw email wil wijzigen.<br><br>

                <div class="emailInput">
                    <label for="email">Nieuwe email:</label>
                    <input type="text" id="emailEdit" name="email" class="email" placeholder="Email">
                </div>

                <div class="emailInput">
                    <label for="password">Wachtwoord:</label>
                    <input type="text" id="passwordEmailEdit" name="password" class="password" placeholder="Wachtwoord">
                </div>

                <div id="emailButtonDiv">
                    <button id="changeEmailSaveButton" class="emailButton">Bevestig</button>
                    <button id="changeEmailCancelButton" class="emailButton">Annuleer wijziging</button>
                </div>

                <p id="passwordEditError" class="profileError"></p>
            </div>
        `;

        // Make an event for the changeEmailSaveButton
        this.setButtonEvents("changeEmailSaveButton", "save-email", "emailSave");

        // Make an event for the changeEmailCancelButton
        this.setButtonEvents("changeEmailCancelButton", "to-profile");
    }
}

window.customElements.define("webshop-profile-email", ProfileEmailComponent);
