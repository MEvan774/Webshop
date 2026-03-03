import { html } from "@web/helpers/webComponents";
import "@web/components/PaymentTileComponent";
import { ShoppingCartService, CartItem } from "@web/services/ShoppingCartService";
import { StripePaymentService, CheckoutItem } from "@web/services/StripePaymentService";
import { AllGameService } from "@web/services/AllGamesService";
import { ProductPrice } from "@shared/types";

/**
 * Payment page component.
 * Reads the shopping cart from localStorage and renders each item as a <payment-tile>.
 * Fetches fresh prices from the API to ensure correct amounts are displayed.
 * Shows price summary and triggers Stripe checkout on "Afrekenen".
 */
export class PaymentComponent extends HTMLElement {
    private readonly _cartService: ShoppingCartService = new ShoppingCartService();
    private readonly _paymentService: StripePaymentService = new StripePaymentService();
    private readonly _gameService: AllGameService = new AllGameService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // Re-render when a tile fires "cart-updated" (item removed)
        this.addEventListener("cart-updated", (): void => {
            void this.render();
        });

        void this.render();
    }

    /**
     * Main render method. Fetches fresh prices from the API, updates the
     * cart in localStorage, then renders tiles and totals with correct prices.
     */
    private async render(): Promise<void> {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = "";

        const items: CartItem[] = this._cartService.getCartItems();

        // Show loading state while fetching prices
        if (items.length > 0) {
            const loadingElement: HTMLElement = html`
            <div id="tileContainer">
                <div id="shoppingCart">
                    <h1>Mijn winkelwagen</h1>
                    <p class="loading-text">Prijzen ophalen...</p>
                </div>
            </div>
            `;

            const loadingStyleLink: HTMLLinkElement = document.createElement("link");
            loadingStyleLink.setAttribute("rel", "stylesheet");
            loadingStyleLink.setAttribute("href", "/assets/css/paymentPage.css");

            const loadingExtraStyles: HTMLStyleElement = document.createElement("style");
            loadingExtraStyles.textContent = `
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

            this.shadowRoot.appendChild(loadingStyleLink);
            this.shadowRoot.appendChild(loadingExtraStyles);
            this.shadowRoot.append(loadingElement);

            // Fetch fresh prices and update cart
            await this.refreshCartPrices(items);

            // Clear loading state and re-read updated items
            this.shadowRoot.innerHTML = "";
        }

        // Re-read items (now with updated prices)
        const updatedItems: CartItem[] = this._cartService.getCartItems();

        // Calculate totals using fresh prices
        let subtotal: number = 0;

        for (const item of updatedItems) {
            subtotal += item.price * item.quantity;
        }

        const discount: number = 0; // Placeholder for discount logic
        const total: number = subtotal - discount;

        // Build tiles HTML
        let tilesHTML: string = "";

        if (updatedItems.length === 0) {
            tilesHTML = "<p class=\"empty-cart\">Je winkelwagen is leeg.</p>";
        }
        else {
            for (const item of updatedItems) {
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
                ${updatedItems.length > 0
                    ? "<a id=\"removeAll\">Verwijder alle spellen</a>"
: ""}
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
            ${updatedItems.length > 0
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
                void this.render();
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

    /**
     * Fetch fresh prices from the API for all cart items and update
     * the cart in localStorage with the correct prices.
     *
     * @param items The current cart items (mutated in place with fresh prices)
     */
    private async refreshCartPrices(items: CartItem[]): Promise<void> {
        try {
            const gameIds: string[] = items.map((item: CartItem) => item.gameId);
            const prices: Record<string, ProductPrice> | null = await this._gameService.getGamePrices(gameIds);

            if (!prices) {
                console.error("Kon prijzen niet ophalen van de API.");
                return;
            }

            // Update each cart item with the fresh price
            let updated: boolean = false;

            for (const item of items) {
                const freshPrice: ProductPrice | undefined = prices[item.gameId];

                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (freshPrice !== undefined && freshPrice.price !== item.price) {
                    item.price = freshPrice.price;
                    updated = true;
                }
            }

            // Persist updated prices back to localStorage
            if (updated) {
                localStorage.setItem("shoppingCart", JSON.stringify(items));
            }
        }
        catch (error) {
            console.error("Fout bij het ophalen van prijzen:", error);
        }
    }
}

window.customElements.define("webshop-payment", PaymentComponent);
