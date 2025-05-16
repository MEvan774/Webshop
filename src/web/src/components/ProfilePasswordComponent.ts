import { UserResult } from "@shared/types";
import { BaseProfileComponent } from "./BaseProfileComponent";

/**
 * Class for the Profile page when changing the password, extends BaseProfileComponent
 */
export class ProfilePasswordComponent extends BaseProfileComponent {
    /**
     * Checks the input of the old password, and both versions of the new password
     *
     * @returns Void
     */
    public async passwordSave(): Promise<void> {
        const user: UserResult | null = await this.getCurrentUser();
        if (!user) return;

        // Get the input of the old password and both versions of the new password
        const oldPasswordInput: HTMLInputElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLInputElement>("#oldPassword");
        const newPasswordInput: HTMLInputElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLInputElement>("#passwordEdit");
        const repeatPasswordInput: HTMLInputElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLInputElement>("#passwordEditRepeat");

        // Get the place for the error messages
        const errorMessagePlace: HTMLParagraphElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLParagraphElement>("#passwordEditError");

        // Get the value of the passwords and trim it
        const oldPassword: string | undefined = oldPasswordInput?.value.trim();
        const newPassword: string | undefined = newPasswordInput?.value.trim();
        const repeatPassword: string | undefined = repeatPasswordInput?.value.trim();

        if (!errorMessagePlace) return;

        // Return if the old password is incorrect
        if (oldPassword !== user.password) {
            errorMessagePlace.innerHTML = "Het oude wachtwoord is incorrect.";
            return;
        }

        // Return if not everything is filled in
        if (!oldPassword || !newPassword || !repeatPassword) {
            errorMessagePlace.innerHTML = "Vul alle velden in om verder te gaan";
            return;
        }

        // Return if the new passwords don't match
        if (newPassword !== repeatPassword) {
            errorMessagePlace.innerHTML = "De nieuwe wachtwoorden komen niet overeen";
            return;
        }

        // Return if the old and new password are the same
        if (newPassword === oldPassword) {
            errorMessagePlace.innerHTML = "Uw nieuwe en oude wachtwoord zijn hetzelfde";
            return;
        }

        // Confirm if password has to be changed, and change it afterwards
        if (window.confirm("Weet u zeker dat u uw wachtwoord wil wijzigen?")) {
            await this.ProfileService.changePassword(user.userId, newPassword);
            window.alert("Uw wachtwoord is gewijzigd.");
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
