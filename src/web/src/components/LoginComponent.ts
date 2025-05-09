import { html } from "@web/helpers/webComponents";
import { LoginService } from "@web/services/LoginService";

/**
 * The content for the register-page is made here. Logic such as scripts go in RegisterService
 */
export class LoginComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <form>
                <div class="loginForm">
                    <h2>Inloggen</h2>
                    <div class="login-grid">
                    <div>
                        <label for="email">Emailadres:</label>
                        <input type="email" id="email" name="email" class="email" placeholder="Email">
                    </div>

                    <div>
                        <label for="password">Wachtwoord:</label>
                        <input type="password" id="password" name="password" class="password" placeholder="Wachtwoord">
                    </div>
                    <div class="full-width">
                        <h3>Heeft u nog geen account? Klik <a href="register.html" class="redirectRegister">hier</a> om te registreren.</h3>
                    </div>
                        <button class="loginBtn">Inloggen</button>
                    <div id="errorMessage" class="error-message"></div>
                </div>
                </div>
            </form>
    `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/loginPage.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.appendChild(styleLink);

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(element);
        const emailInput: HTMLInputElement | null = this.shadowRoot.querySelector("#email");
        const passwordInput: HTMLInputElement | null = this.shadowRoot.querySelector("#password");

        if (!emailInput || !passwordInput) {
            console.log("One of the input fields is missing");
        }
        else {
            const loginBtn: HTMLButtonElement | null = this.shadowRoot.querySelector(".loginBtn");
            const loginUser: LoginService = new LoginService();
            if (loginBtn) {
                loginBtn.addEventListener("click", async e => {
                    e.preventDefault();
                    const check: { valid: boolean; message?: string } = loginUser.checkData(emailInput.value, passwordInput.value);

                    const errorDiv: Element | null | undefined = this.shadowRoot?.querySelector("#errorMessage");
                    if (!check.valid) {
                        if (errorDiv) errorDiv.textContent = check.message || "Ongeldige invoer.";
                        return;
                    }
                    else {
                        if (errorDiv) errorDiv.textContent = "";
                    }
                    await loginUser.loginUser(emailInput.value, passwordInput.value);
                    window.location.href = "/index.html";
                });
            }
        }
    }
}

window.customElements.define("webshop-login", LoginComponent);
