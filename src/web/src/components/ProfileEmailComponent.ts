import { UserResult } from "@shared/types";
import { BaseProfileComponent } from "./BaseProfileComponent";
import { EmailService } from "@web/services/EmailService";
import { ProfileService } from "@web/services/ProfileService";
import bcrypt from "bcryptjs";

/**
 * Class for the edit email profile page, extends BaseProfileCompon ent
 */
export class ProfileEmailComponent extends BaseProfileComponent {
    private readonly _emailService: EmailService = new EmailService();
    private readonly _profileService: ProfileService = new ProfileService();

    /**
     * Save the new email and check if the input is correct
     *
     * @returns Void
     */
    public async emailSave(): Promise<void> {
        const user: UserResult | null = await this.getCurrentUser();
        if (!user) return;

        const name: string = user.firstname + " " + user.lastname;

        // Get input fields
        const emailInput: HTMLInputElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLInputElement>("#emailEdit");
        const passwordInput: HTMLInputElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLInputElement>("#passwordEmailEdit");

        // Get the place for error messages
        const errorMessagePlace: HTMLParagraphElement | null | undefined =
          this.shadowRoot?.querySelector<HTMLParagraphElement>("#passwordEditError");

        // Get and trim the values of the email and password
        const email: string | undefined = emailInput?.value.trim();
        const password: string | undefined = passwordInput?.value.trim();

        if (!errorMessagePlace) return;

        // Return if not all fields are filled in
        if (!email || !password) {
            errorMessagePlace.innerHTML = "Vul alle velden in om verder te gaan!";
            return;
        }

        // Return if the old password is incorrect
        const matchPassword: boolean = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            errorMessagePlace.innerHTML = "Het oude wachtwoord is incorrect.";
            return;
        }

        // Return if the new email is the same as the current email
        if (email === user.email) {
            errorMessagePlace.innerHTML = "Dit is je huidige email!";
            return;
        }

        // Check if the email is free and return if not
        const emailFree: boolean = await this._emailService.isEmailUsed(email);

        if (!emailFree) {
            errorMessagePlace.innerHTML = "Deze email is al bezet!";
            return;
        }

        // Confirm the change, and send the confirmation emails
        if (window.confirm("Weet u zeker dat u uw email wil veranderen?")) {
            window.alert("Bevestig de wijziging via de mail in uw mailbox");

            await this._profileService.writeEmail("old", name, user.email, user.userId, email);
            await this._profileService.writeEmail("new", name, email, user.userId);

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
