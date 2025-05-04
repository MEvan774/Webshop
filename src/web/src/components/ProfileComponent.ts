import { UserResult } from "@shared/types";
import { getUser } from "@web/services/ProfileService";

export class ProfileComponent extends HTMLElement {
    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        await this.render();
    }

    private async getCurrentUser(): Promise<UserResult | null> {
        return await getUser();
    }

    private formatDate(dateString: string): string {
        const date: Date = new Date(dateString);

        return date.toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    private getGender(gender: string): string {
        if (gender === "female") return "Vrouw";

        if (gender === "male") return "Male";

        if (gender === "non-binary") return "Non-binair";

        return "Anders/onbekend";
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const user: UserResult | null = await this.getCurrentUser();

        if (!user) return;

        // Set variables
        const profilePicture: string = user.profilePicture ?? "/assets/images/userImage.png";
        const name: string = user.firstname + " " + user.lastname;
        const date: string = this.formatDate(user.dob);
        const country: string = user.country ?? "Locatie onbekend";
        const gender: string = this.getGender(user.gender);

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/assets/css/currentGame.css">
            <img id="profilePicture" src="${profilePicture}" width="500px"><br>

            <div id="profileDiv">
                <h1>${name}</h1>
                <p>${date}</p>
                <p>${country}</p>
                <p>${gender}</p>
                <button id="editButton">Profiel bewerken</button>
            </div>

            <h1>Gekochte spellen:</h1>
        `;

        // Profiel bewerken knop
        const editButton: HTMLButtonElement | null = this.shadowRoot.querySelector("#editButton");

        if (editButton) {
            editButton.addEventListener("click", () => {
                this.dispatchEvent(new CustomEvent("edit-profile", { bubbles: true }));
            });
        }
    }
}

window.customElements.define("webshop-profile", ProfileComponent);
