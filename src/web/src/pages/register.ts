import "@web/components/NavComponent";
import "@web/components/RegisterComponent";

import { html } from "@web/helpers/webComponents";

class RegisterPageComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <div>
                <div>
                    <webshop-register></webshop-register>
                </div>
            </div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/registerFromPages.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);
    }
}

window.customElements.define("webshop-page-register", RegisterPageComponent);
