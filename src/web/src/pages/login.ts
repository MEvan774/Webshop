import "@web/components/NavigationComponent";
import "@web/components/LoginComponent";

import { html } from "@web/helpers/webComponents";

class LoginPageComponent extends HTMLElement {
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
                <webshop-navigation></webshop-navigation>

                <div>
                    <h1>
                        Welkom bij de LucaStars Webshop!
                    </h1>

                    <p>
                        Dit is login.html!
                    </p>

                    <webshop-login></webshop-login>
                </div>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-login", LoginPageComponent);
