import { html } from "@web/helpers/webComponents";
import "@web/components/PaymentTileComponent";
import { ShoppingCartService } from "@web/services/ShoppingCartService";

export class PaymentComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = "";

        const element: HTMLElement = html`
        <div id="tileContainer">
            <div id="shoppingCart">
                <h1>Mijn winkelwagen</h1>
                <payment-tile></payment-tile>
                <a>Verwijder alle spellen</a>
            </div>
            <div id="priceContainer">
                <div id="price">
                    <p>Price</p>
                    <p>*insert price*</p>
                </div>
                <div id="discountAmount">
                    <p>Korting</p>
                    <p>*insert price*</p>
                </div>
                <div id="discountInput">
                    <p>Kortingscode</p>
                    <input placeholder="ABCDEFGH">
                </div>
                <div id="totalPrice">
                    <p>Te betalen</p>
                    <p>*insert price*</p>
                </div>
            </div>
            <a class="checkout" href="/payment.html">Afrekenen</a>
        </div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/paymentPage.css");

        this.shadowRoot.appendChild(styleLink);
        this.shadowRoot.append(element);

        const removeAllItems: HTMLAnchorElement = document.querySelector("a")!;
        removeAllItems.addEventListener("click", () => new ShoppingCartService().removeAllFromCart());
    }
}

window.customElements.define("webshop-payment", PaymentComponent);
