import { UserResult } from "@shared/types";
import { IProfileChangePasswordService } from "@web/interfaces/IProfileChangePasswordService";
import bcrypt from "bcryptjs";

/**
 * Class for editing the password, implements IProfileChangePasswordService
 */
export class ProfileChangePasswordService implements IProfileChangePasswordService {
    /**
     * Checks the input of the old password, and both versions of the new password
     *
     * @returns Void
     */
    public async passwordSave(user: UserResult, shadowRoot: ShadowRoot): Promise<boolean> {
        // Get the input of the old password and both versions of the new password
        const oldPasswordInput: HTMLInputElement | null | undefined =
          shadowRoot.querySelector<HTMLInputElement>("#oldPassword");
        const newPasswordInput: HTMLInputElement | null | undefined =
          shadowRoot.querySelector<HTMLInputElement>("#passwordEdit");
        const repeatPasswordInput: HTMLInputElement | null | undefined =
          shadowRoot.querySelector<HTMLInputElement>("#passwordEditRepeat");

        // Get the place for the error messages
        const errorMessagePlace: HTMLParagraphElement | null | undefined =
          shadowRoot.querySelector<HTMLParagraphElement>("#passwordEditError");

        // Get the value of the passwords and trim it
        const oldPassword: string | undefined = oldPasswordInput?.value.trim();
        const newPassword: string | undefined = newPasswordInput?.value.trim();
        const repeatPassword: string | undefined = repeatPasswordInput?.value.trim();

        if (!errorMessagePlace) return false;

        // Return if not everything is filled in
        if (!oldPassword || !newPassword || !repeatPassword) {
            errorMessagePlace.innerHTML = "Vul alle velden in om verder te gaan";
            return false;
        }

        // Return if the old password is incorrect
        const matchPassword: boolean = await bcrypt.compare(oldPassword, user.password);

        if (!matchPassword) {
            errorMessagePlace.innerHTML = "Het oude wachtwoord is incorrect.";
            return false;
        }

        // Return if the new passwords don't match
        if (newPassword !== repeatPassword) {
            errorMessagePlace.innerHTML = "De nieuwe wachtwoorden komen niet overeen";
            return false;
        }

        // Return if the old and new password are the same
        if (newPassword === oldPassword) {
            errorMessagePlace.innerHTML = "Uw nieuwe en oude wachtwoord zijn hetzelfde";
            return false;
        }

        // Confirm if password has to be changed, and change it afterwards
        if (window.confirm("Weet u zeker dat u uw wachtwoord wil wijzigen?")) {
            if (await this.changePassword(user.userId, newPassword)) {
                window.alert("Uw wachtwoord is gewijzigd.");
                return true;
            }

            errorMessagePlace.innerHTML = "Er ging iets mis met de applicatie, probeer later opnieuw.";
            return false;
        }
        return false;
    }

    /**
     * Change the password
     *
     * @param userID UserID of the user as number
     * @param newPassword The new password of the user as string
     * @returns Void
     */
    public async changePassword(userID: number, newPassword: string): Promise<boolean> {
        const password: string = await bcrypt.hash(newPassword, 10);

        try {
            const response: Response = await fetch(`${VITE_API_URL}user/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ userID, password }),
            });

            if (!response.ok) {
                const error: string = await response.text();
                console.error("Failed to change password:", error);
                return false;
            }

            return true;
        }
        catch (error: unknown) {
            console.error("Wachtwoord veranderen is mislukt door: ", error);
            return false;
        }
    }
}
