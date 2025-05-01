import { html } from "@web/helpers/webComponents";

export class ProfileComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

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
