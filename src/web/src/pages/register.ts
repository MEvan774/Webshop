import "@web/components/NavigationComponent";
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
                <webshop-navigation></webshop-navigation>

                <div>
                    <h1>
                        Welkom bij de LucaStars Webshop!
                    </h1>

                    <p>
                        Dit is register.html!
                    </p>

                    <webshop-register></webshop-register>
                </div>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-register", RegisterPageComponent);
