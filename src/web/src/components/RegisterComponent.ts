import { html } from "@web/helpers/webComponents";
import { RegisterService } from "@web/services/RegisterService";

/**
 * The content for the register-page is made here. Logic such as scripts go in RegisterService
 */
export class RegisterComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
                    <div class="registerForm">
                        <div class="register-grid">
                    <div>
                        <label for="fname">Voornaam:</label>
                        <input type="text" id="fname" name="fname" class="fname" placeholder="Voornaam">
                    </div>
                    <div>
                        <label for="lname">Achternaam:</label>
                        <input type="text" id="lname" name="lname" class="lname" placeholder="Achternaam">
                    </div>
                    <div>
                        <label for="dob">Geboortedatum:</label>
                        <input type="date" id="dob" name="dob" class="dob">
                    </div>
                    <div>
                        <label for="gender">Geslacht:</label>
                        <select id="gender" name="gender" class="gender">
                            <option value="">Maak een keuze..</option>
                            <option value="female">Vrouw</option>
                            <option value="male">Man</option>
                            <option value="non-binary">Non-Binary</option>
                            <option value="other">Anders</option>
                            <option value="Prefer not to answer">Liever geen antwoord</option>
                        </select>
                    </div>
                        <div class="full-width">
                            <label for="email">Emailadres:</label>
                            <input type="email" id="email" name="email" class="email" placeholder="Email">
                        </div>

                        <div class="full-width">
                            <label for="password">Wachtwoord:</label>
                            <input type="password" id="password" name="password" class="password" placeholder="Wachtwoord">
                        </div>
                        <div class="full-width">
                            <label for="passwordRepeat">Herhaal wachtwoord:</label>
                            <input type="password" id="passwordRepeat" name="passwordRepeat" class="passwordRepeat" placeholder="Herhaal wachtwoord">
                        </div>
                        <div class="full-width">
                            <input type="checkbox" id="newsletter" name="newsletter" value="newsletterAgree">
                            <label for="newsletter"> Meld je aan voor de LucaStars nieuwsbericht voor de nieuwste acties!</label>
                        </div>
                        <div class="full-width">
                            <input type="checkbox" id="terms" name="terms" value="termsAgree">
                            <label for="terms"> Ik ga akkoord met de voorwaarden van LucaStars.</label>
                        </div>
                    </div>
                        <button class="registerBtn">Registreer</button>
                        <div id="errorMessage" class="error-message"></div>
                        <div id="successMessage" class="success-message"></div>
            </form>
        </div>
    `;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = "";
            this.shadowRoot.appendChild(element);

            const fnameInput: HTMLInputElement | null = this.shadowRoot.querySelector("#fname");
            const lnameInput: HTMLInputElement | null = this.shadowRoot.querySelector("#lname");
            const emailInput: HTMLInputElement | null = this.shadowRoot.querySelector("#email");
            const dobInput: HTMLInputElement | null = this.shadowRoot.querySelector("#dob");
            const genderInput: HTMLInputElement | null = this.shadowRoot.querySelector("#gender");
            const passwordInput: HTMLInputElement | null = this.shadowRoot.querySelector("#password");
            const passwordRepeat: HTMLInputElement | null = this.shadowRoot.querySelector("#passwordRepeat");
            const errorDiv: Element | null | undefined = this.shadowRoot.querySelector("#errorMessage");
            const successDiv: Element | null | undefined = this.shadowRoot.querySelector("#successMessage");

            if (!fnameInput || !lnameInput || !emailInput || !dobInput || !genderInput || !passwordInput || !passwordRepeat) {
                console.log("One of the input fields is missing");
            }
            else {
                const registerBtn: HTMLButtonElement | null = this.shadowRoot.querySelector(".registerBtn");
                const registerService: RegisterService = new RegisterService();
                if (registerBtn) {
                    registerBtn.addEventListener("click", async e => {
                        e.preventDefault();
                        const errorMessages: string[] = [];
                        const check: { valid: boolean; messages: string[] } = registerService.checkData(fnameInput.value, lnameInput.value, emailInput.value, dobInput.value, genderInput.value, passwordInput.value, passwordRepeat.value);
                        if (!check.valid) {
                            errorMessages.push(...check.messages);
                        }

                        const userExists: boolean = await registerService.getUserByEmail(emailInput.value);
                        if (userExists) {
                            errorMessages.push("Er bestaat al een account met dit e-mailadres.");
                        }

                        if (errorMessages.length > 0) {
                            if (errorDiv) {
                                errorDiv.textContent = errorMessages.join(" | ");
                            }
                            if (successDiv) {
                                successDiv.textContent = "";
                            }
                            return;
                        }

                        if (!userExists) {
                            const userRegister: boolean = await registerService.registerUser(fnameInput.value, lnameInput.value, emailInput.value, dobInput.value, genderInput.value, passwordInput.value);
                            if (successDiv && userRegister) {
                                successDiv.textContent = "Account succesvol aangemaakt.";
                            }
                        }
                    });
                }
            }
        }
        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/registerPage.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);
    }
}

window.customElements.define("webshop-register", RegisterComponent);
