import { UserResult } from "@shared/types";
import { BaseProfileComponent } from "./BaseProfileComponent";
import { changePassword } from "@web/services/ProfileService";

export class ProfilePasswordComponent extends BaseProfileComponent {
    public async passwordSave(): Promise<void> {
        const user: UserResult | null = await this.getCurrentUser();
        if (!user) return;

        const oldPasswordInput: HTMLInputElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLInputElement>("#oldPassword");
        const newPasswordInput: HTMLInputElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLInputElement>("#passwordEdit");
        const repeatPasswordInput: HTMLInputElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLInputElement>("#passwordEditRepeat");

        const errorMessagePlace: HTMLParagraphElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLParagraphElement>("#passwordEditError");

        const oldPassword: string | undefined = oldPasswordInput?.value.trim();
        const newPassword: string | undefined = newPasswordInput?.value.trim();
        const repeatPassword: string | undefined = repeatPasswordInput?.value.trim();

        if (!errorMessagePlace) return;

        if (!oldPassword || !newPassword || !repeatPassword) {
            errorMessagePlace.innerHTML = "Vul alle velden in om verder te gaan";
            return;
        }

        if (newPassword !== repeatPassword) {
            errorMessagePlace.innerHTML = "De nieuwe wachtwoorden komen niet overeen";
            return;
        }

        if (newPassword === oldPassword) {
            errorMessagePlace.innerHTML = "Uw nieuwe en oude wachtwoord zijn hetzelfde";
            return;
        }

        if (window.confirm("Weet u zeker dat u uw wachtwoord wil wijzigen?")) {
            await changePassword(user.userId, newPassword);
            window.alert("Uw wachtwoord is gewijzigd.");
            this.dispatchEvent(new CustomEvent("save-profile", { bubbles: true }));
        }
    }

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
        this.setButtonEvents("changePasswordCancelButton", "save-profile");
    }
}

window.customElements.define("webshop-profile-password", ProfilePasswordComponent);
