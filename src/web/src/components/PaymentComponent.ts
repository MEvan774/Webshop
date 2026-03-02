import { html } from "@web/helpers/webComponents";
import "@web/components/PaymentTileComponent";
import { ShoppingCartService, CartItem } from "@web/services/ShoppingCartService";
import { StripePaymentService, CheckoutItem } from "@web/services/StripePaymentService";

/**
 * Payment page component.
 * Reads the shopping cart from localStorage and renders each item as a <payment-tile>.
 * Shows price summary and triggers Stripe checkout on "Afrekenen".
 */
export class PaymentComponent extends HTMLElement {
    private readonly _cartService: ShoppingCartService = new ShoppingCartService();
    private readonly _paymentService: StripePaymentService = new StripePaymentService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // Re-render when a tile fires "cart-updated" (item removed)
        this.addEventListener("cart-updated", (): void => {
            this.render();
        });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = "";

        const items: CartItem[] = this._cartService.getCartItems();

        // Calculate totals using stored prices
        let subtotal: number = 0;

        for (const item of items) {
            subtotal += item.price * item.quantity;
        }

        const discount: number = 0; // Placeholder for discount logic
        const total: number = subtotal - discount;

        // Build tiles HTML
        let tilesHTML: string = "";

        if (items.length === 0) {
            tilesHTML = "<p class=\"empty-cart\">Je winkelwagen is leeg.</p>";
        }
        else {
            for (const item of items) {
                tilesHTML += `
                    <payment-tile
                        game-id="${item.gameId}"
                        game-title="${item.title}"
                        game-image="${item.thumbnail}"
                        game-price="${item.price.toFixed(2)}"
                        game-original-price="${item.price.toFixed(2)}"
                        game-savings="0"
                        game-qty="${item.quantity}"
                    ></payment-tile>
                `;
            }
        }

        const element: HTMLElement = html`
        <div id="tileContainer">
            <div id="shoppingCart">
                <h1>Mijn winkelwagen</h1>
                ${tilesHTML}
                ${items.length > 0 ? "<a id=\"removeAll\">Verwijder alle spellen</a>" : ""}
            </div>
            <div id="priceContainer">
                <div id="price">
                    <p>Prijs</p>
                    <p>$${subtotal.toFixed(2)}</p>
                </div>
                <div id="discountAmount">
                    <p>Korting</p>
                    <p>-$${discount.toFixed(2)}</p>
                </div>
                <div id="discountInput">
                    <p>Kortingscode</p>
                    <input placeholder="ABCDEFGH">
                </div>
                <div id="totalPrice">
                    <p>Te betalen</p>
                    <p>$${total.toFixed(2)}</p>
                </div>
            </div>
            ${items.length > 0
                ? "<a class=\"checkout\" id=\"checkoutBtn\">Afrekenen</a>"
                : ""}
        </div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/paymentPage.css");

        const extraStyles: HTMLStyleElement = document.createElement("style");
        extraStyles.textContent = `
            .loading-text {
                color: #666;
                font-style: italic;
                padding: 20px 0;
            }
            .empty-cart {
                color: #666;
                padding: 20px 0;
            }
        `;

        this.shadowRoot.appendChild(styleLink);
        this.shadowRoot.appendChild(extraStyles);
        this.shadowRoot.append(element);

        // --- Event listeners ---

        // "Remove all" link
        const removeAllLink: HTMLAnchorElement | null = this.shadowRoot.querySelector("#removeAll");

        if (removeAllLink) {
            removeAllLink.addEventListener("click", (): void => {
                this._cartService.removeAllFromCart();
                this.render();
            });
        }

        // "Afrekenen" button → Stripe checkout
        const checkoutBtn: HTMLAnchorElement | null = this.shadowRoot.querySelector("#checkoutBtn");

        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", async (): Promise<void> => {
                const cartItems: CartItem[] = this._cartService.getCartItems();

                if (cartItems.length === 0) {
                    alert("Je winkelwagen is leeg.");
                    return;
                }

                // Map cart items to CheckoutItem format
                const checkoutItems: CheckoutItem[] = cartItems.map((item: CartItem) => ({
                    name: item.title,
                    price: item.price,
                    quantity: item.quantity,
                }));

                try {
                    await this._paymentService.startCheckout(checkoutItems);
                    this._cartService.removeAllFromCart();
                }
                catch (error) {
                    console.error("Checkout mislukt:", error);
                    alert("Er ging iets mis bij het afrekenen. Probeer het opnieuw.");
                }
            });
        }
    }
}

window.customElements.define("webshop-payment", PaymentComponent);
