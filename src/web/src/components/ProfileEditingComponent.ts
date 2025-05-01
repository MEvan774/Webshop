import { html } from "@web/helpers/webComponents";

export class ProfileEditingComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <button id="editSaveButton">Bewerking opslaan</button>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/currentGame.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);

        const editSaveButton: HTMLButtonElement | null = this.shadowRoot.querySelector("#editSaveButton");

        if (editSaveButton) {
            console.log("yes");
            editSaveButton.addEventListener("click", () => {
                console.log("click");
                this.dispatchEvent(new CustomEvent("save-profile", { bubbles: true }));
            });
        }
    }
}

window.customElements.define("webshop-profile-editing", ProfileEditingComponent);

// <img id="profilePicture" src="/assets/images/userImage.png" width=500px;>
