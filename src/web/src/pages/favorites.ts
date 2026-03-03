import "@web/components/NavComponent";
import "@web/components/FavoritesComponent";
import { html } from "@web/helpers/webComponents";

class FavoritesPageComponent extends HTMLElement {
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
            <webshop-favorites></webshop-favorites>
        </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-favorites", FavoritesPageComponent);
