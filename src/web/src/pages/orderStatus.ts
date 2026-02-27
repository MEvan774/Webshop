import "@web/components/NavComponent";
import "@web/components/OrderStatusComponent";
import { html } from "@web/helpers/webComponents";

class OrderStatusPageComponent extends HTMLElement {
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
            <webshop-order-status></webshop-order-status>
        </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-order-status", OrderStatusPageComponent);
