import { html } from "@web/helpers/webComponents";
import { RegisterService } from "@web/services/RegisterService";

export class RegisterComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    // private async render(): Promise<void> {
    //     if (!this.shadowRoot) {
    //         return;
    //     }
    //     const userId: number | undefined = await new RegisterService().testQuery();
    //     if (userId !== undefined) {
    //         const userService: RegisterService = new RegisterService();
    //         const users: UserResult[] = await userService.getAllUsers();
    //         const user: UserResult | undefined = users.find(user => user.userId === userId);
    //         const element: HTMLElement = html`
    //             <div>
    //                 <h2>Gebruiker ID: ${userId}</h2>
    //                 <p><strong>Naam:</strong> ${user ? user.firstname + " " + user.lastname : "Onbekend"}</p>
    //                 <p><strong>Email:</strong> ${user ? user.email : "Onbekend"}</p>
    //                 <p><strong>Geboortedatum:</strong> ${user ? user.dob : "Onbekend"}</p>
    //                 <p><strong>Geslacht:</strong> ${user ? user.gender : "Onbekend"}</p>
    //             </div>
    //         `;

    //         this.shadowRoot.firstChild?.remove();
    //         this.shadowRoot.append(element);
    //     }
    //     else {
    //         // Weergeven wanneer geen gebruiker wordt gevonden
    //         const element: HTMLElement = html`
    //             <div>
    //                 <h2>Geen gebruiker gevonden of niet ingelogd</h2>
    //             </div>
    //         `;
    //         this.shadowRoot.firstChild?.remove();
    //         this.shadowRoot.append(element);
    //     }
    // }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
        <div>
            <form>
                <label for="voornaam">Voornaam:</label><br>
                <input type="text" id="fname" name="fname" value="Voornaam" class="fname"><br>
                <label for="achternaam">Achternaam:</label><br>
                <input type="text" id="lname" name="lname" value="Achternaam" class="lname"><br>
                <label for="dob">Geboortedatum:</label><br>
                <input type="date" id="dob" name="dob" class="dob"><br>
                <label for="geslacht">Geslacht:</label><br>
                <select name="geslacht" class="gender" id="gender">
                    <option value="">Maak een keuze..</option>
                    <option value="female">Vrouw</option>
                    <option value="male">Man</option>
                    <option value="non-binary">Non-Binary</option>
                    <option value="other">Anders</option>
                    <option value="Prefer not to answer">Liever geen antwoord</option>
                </select><br>
                <label for="email">Emailadres:</label><br>
                <input type="text" id="email" name="email" value="Email" class="email"><br>
                <label for="wachtwoord">Wachtwoord:</label><br>
                <input type="password" id="password" name="password" class="password"><br>
                <label for="wachtwoordHerhaling">Herhaal wachtwoord:</label><br>
                <input type="password" id="passwordRepeat" name="passwordRepeat" class="passwordRepeat"><br>
                <br>
                <button class="registerBtn">Submit</button>
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

            if (!fnameInput || !lnameInput || !emailInput || !dobInput || !genderInput || !passwordInput || !passwordRepeat) {
                console.log("One of the input fields is missing");
            }
            else {
                const registerBtn: HTMLButtonElement | null = this.shadowRoot.querySelector(".registerBtn");
                const registerUser: RegisterService = new RegisterService();
                if (registerBtn) {
                    registerBtn.addEventListener("click", async e => {
                        e.preventDefault();
                        await registerUser.onClickRegister(fnameInput.value, lnameInput.value, emailInput.value, dobInput.value, genderInput.value, passwordInput.value, passwordRepeat.value);
                    });
                }
            }
        }

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-register", RegisterComponent);
