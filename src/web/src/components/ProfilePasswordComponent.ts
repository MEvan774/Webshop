import { UserResult } from "@shared/types";
import { BaseProfileComponent } from "./BaseProfileComponent";
import { changePassword } from "@web/services/ProfileService";

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
            await changePassword(user.userId, newPassword);
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
            Bij het wijzigen van uw wachtwoord wordt er een bevestigingsemail gestuurd.<br>
            Hier kan u de wijziging annuleren, maar deze email is niet nodig voor de wijziging.<br><br>

            <div>
                <label for="oldPassword">Huidige wachtwoord:</label>
                <input type="text" id="oldPassword" name="oldPassword" class="password"
                  placeholder="Oude wachtwoord">
            </div>

            <div>
                <label for="newPassword">Nieuwe wachtwoord:</label>
                <input type="text" id="passwordEdit" name="newPassword" class="password"
                  placeholder="Nieuwe wachtwoord">
            </div>

            <div>
                <label for="repeatPassword">Herhaal nieuw wachtwoord:</label>
                <input type="text" id="passwordEditRepeat" name="repeatPassword" class="password"
                  placeholder="Herhaal nieuw wachtwoord">
            </div>

            <button id="changePasswordSaveButton">Bevestig</button>
            <button id="changePasswordCancelButton">Annuleer wijziging</button>

            <p id="passwordEditError" class="profileError"></p>
        `;

        // Make an event for the changePasswordSaveButton
        this.setButtonEvents("changePasswordSaveButton", "save-password", "passwordSave");

        // Make an event for the changePasswordCancelButton
        this.setButtonEvents("changePasswordCancelButton", "to-profile");
    }
}

window.customElements.define("webshop-profile-password", ProfilePasswordComponent);
