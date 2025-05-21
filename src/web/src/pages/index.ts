import "@web/components/NavComponent";
import "@web/components/WelcomeComponent";
import "@web/components/SidebarComponent";
import { WebshopEvent } from "@web/enums/WebshopEvent";

import { html } from "@web/helpers/webComponents";
import { WebshopEventService } from "@web/services/WebshopEventService";

export class IndexPageComponent extends HTMLElement {
    private _webshopEventService: WebshopEventService = new WebshopEventService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // NOTE: This is just an example event, remove it!
        this._webshopEventService.addEventListener<string>(WebshopEvent.Welcome, message => {
            console.log(`Welcome event triggered: ${message}`);
        });

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
                    <webshop-welcome></webshop-welcome>
                    <webshop-sidebar></webshop-sidebar>
                </div>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-index", IndexPageComponent);
