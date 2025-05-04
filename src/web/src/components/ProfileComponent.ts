import { UserResult } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { getUser } from "@web/services/ProfileService";

export class ProfileComponent extends HTMLElement {
    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        await this.render();
    }

    private async getCurrentUser(): Promise<UserResult | null> {
        return await getUser();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const user: UserResult | null = await this.getCurrentUser();

        if (!user) return;

        console.log(user);

        const element: HTMLElement = html`
            
            <button id="editButton">Edit profile</button>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/currentGame.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);

        const editButton: HTMLButtonElement | null = this.shadowRoot.querySelector("#editButton");

        if (editButton) {
            console.log("yes");
            editButton.addEventListener("click", () => {
                console.log("click");
                this.dispatchEvent(new CustomEvent("edit-profile", { bubbles: true }));
            });
        }
    }
}

window.customElements.define("webshop-profile", ProfileComponent);
