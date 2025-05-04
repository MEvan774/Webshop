import "@web/components/NavComponent";
import "@web/components/ProfileComponent";
import "@web/components/ProfileEditingComponent";
import "@web/components/ProfileEmailComponent";
import "@web/components/ProfilePasswordComponent";
import { html } from "@web/helpers/webComponents";

export class ProfilePageComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.shadowRoot?.addEventListener("edit-profile", () => {
            this.render("<webshop-profile-editing></webshop-profile-editing>");
        });

        this.shadowRoot?.addEventListener("save-profile", () => {
            this.render("<webshop-profile></webshop-profile>");
        });

        this.shadowRoot?.addEventListener("change-email", () => {
            this.render("<webshop-profile-email></webshop-profile-email>");
        });

        this.shadowRoot?.addEventListener("change-password", () => {
            this.render("<webshop-profile-password></webshop-password>");
        });

        this.render();
    }

    private render(state?: string): void {
        if (!this.shadowRoot) {
            return;
        }

        const currentState: string = state ?? "<webshop-profile></webshop-profile>";

        const element: HTMLElement = html`
            <div>
                <nav-bar></nav-bar>

                <div>
                    ${currentState}
                </div>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-profile", ProfilePageComponent);
