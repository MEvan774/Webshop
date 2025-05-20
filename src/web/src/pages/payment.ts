import "@web/components/NavComponent";
import "@web/components/PaymentComponent";
import { html } from "@web/helpers/webComponents";

class PaymentPageComponent extends HTMLElement {
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
            <webshop-payment></webshop-payment>
        </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-payment", PaymentPageComponent);
