import "@web/components/NavComponent";
import "@web/components/ProfileComponent";
import "@web/components/ProfileEditingComponent";
import { WebshopEvent } from "@web/enums/WebshopEvent";

import { html } from "@web/helpers/webComponents";
import { WebshopEventService } from "@web/services/WebshopEventService";

export class ProfilePageComponent extends HTMLElement {
    private _webshopEventService: WebshopEventService = new WebshopEventService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.shadowRoot?.addEventListener("edit-profile", () => {
            this.editing(true);
        });

        this.shadowRoot?.addEventListener("save-profile", () => {
            this.editing(false);
        });

        // NOTE: This is just an example event, remove it!
        this._webshopEventService.addEventListener<string>(WebshopEvent.Welcome, message => {
            console.log(`Welcome event triggered: ${message}`);
        });

        this.render();
    }

    private render(editing?: boolean): void {
        if (!this.shadowRoot) {
            return;
        }

        let element: HTMLElement = html``;

        if (editing) {
            element = html`
                <div>
                    <nav-bar></nav-bar>

                    <div>
                        <webshop-profile-editing></webshop-profile-editing>
                    </div>
                </div>
            `;
        }
        else {
            element = html`
                <div>
                    <nav-bar></nav-bar>

                    <div>
                        <webshop-profile></webshop-profile>
                    </div>
                </div>
            `;
        }

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }

    public editing(editing: boolean): void {
        this.render(editing);
    }
}

window.customElements.define("webshop-page-profile", ProfilePageComponent);
