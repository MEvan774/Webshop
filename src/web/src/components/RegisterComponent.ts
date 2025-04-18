import { html } from "@web/helpers/webComponents";
import { RegisterService } from "@web/services/RegisterService";

export class RegisterComponent extends HTMLElement {
    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        await this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        // Roep de testQuery aan om de gebruikers op te halen
        const userId: number | undefined = await new RegisterService().testQuery();

        const element: HTMLElement = html`
            <div>
                <h2>Gebruiker ID: ${userId}</h2>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }

    // private render(): void {
    //     if (!this.shadowRoot) {
    //         return;
    //     }

    //     const element: HTMLElement = html`
    //         <div>
    //             <form>
    //                 <label for="voornaam">Voornaam:</label><br>
    //                 <input type="text" id="fname" name="fname" value="Voornaam" class="fname"><br>
    //                 <label for="achternaam">Achternaam:</label><br>
    //                 <input type="text" id="lname" name="lname" value="Achternaam" class="lname"><br>
    //                 <label for="dob">Geboortedatum:</label><br>
    //                 <input type="date" id="dob" name="dob"><br>
    //                 <label for="geslacht">Geslacht:</label><br>
    //                 <select name="geslacht">
    //                     <option value="">Maak een keuze..</option>
    //                     <option value="female">Vrouw</option>
    //                     <option value="male">Man</option>
    //                     <option value="non-binary">Non-Binary</option>
    //                     <option value="other">Anders</option>
    //                     <option value="Prefer not to answer">Liever geen antwoord</option>
    //                 </select><br>
    //                 <label for="email">Emailadres:</label><br>
    //                 <input type="text" id="email" name="email" value="Email"><br>
    //                 <label for="wachtwoord">Wachtwoord:</label><br>
    //                 <input type="password" id="wachtwoord" name="wachtwoord"><br>
    //                 <label for="wachtwoordHerhaling">Herhaal wachtwoord:</label><br>
    //                 <input type="password" id="wachtwoordHerhaling" name="wachtwoordHerhaling"><br>
    //                 <br>
    //                 <button class="registerBtn">Submit</button>
    //             </form>
    //         </div>
    //     `;

    //     const registerBtn: HTMLButtonElement | null = element.querySelector(".registerBtn");
    //     if (registerBtn) {
    //         registerBtn.addEventListener("click", e => {
    //             e.preventDefault();
    //             console.log("Hey");
    //         });
    //     }

    //     this.shadowRoot.firstChild?.remove();
    //     this.shadowRoot.append(element);
    // }
}

window.customElements.define("webshop-register", RegisterComponent);
