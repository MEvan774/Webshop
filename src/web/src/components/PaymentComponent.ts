/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { html } from "@web/helpers/webComponents";
import "@web/components/PaymentTileComponent";
import { ShoppingCartService, CartItem } from "@web/services/ShoppingCartService";
import { StripePaymentService, CheckoutItem } from "@web/services/StripePaymentService";
import { CheapSharkGameDetail, CheapSharkGameDeal } from "@shared/types";

/**
 * Represents the resolved price data for a single cart item.
 */
type ResolvedPrice = {
    salePrice: number;
    retailPrice: number;
    savings: number;
};

/**
 * Payment page component.
 * Reads the shopping cart from localStorage, fetches live prices
 * directly from the CheapShark API, and renders each item as a <payment-tile>.
 * Shows price summary and triggers Stripe checkout on "Afrekenen".
 */
export class PaymentComponent extends HTMLElement {
    private readonly _cartService: ShoppingCartService = new ShoppingCartService();
    private readonly _paymentService: StripePaymentService = new StripePaymentService();

    /** Live resolved prices, keyed by gameId */
    private _prices: Record<string, ResolvedPrice> = {};

    /** Whether prices are currently being fetched */
    private _isLoading: boolean = true;

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });

        // Re-render when a tile fires "cart-updated" (item removed)
        this.addEventListener("cart-updated", (): void => {
            void this.loadPricesAndRender();
        });

        await this.loadPricesAndRender();
    }

    /**
     * Fetches live prices directly from CheapShark for all cart items,
     * then renders the component.
     */
    private async loadPricesAndRender(): Promise<void> {
        this._isLoading = true;
        this.render();

        const items: CartItem[] = this._cartService.getCartItems();

        // Fetch prices for each game directly from CheapShark
        const pricePromises: Promise<void>[] = items.map(async (item: CartItem): Promise<void> => {
            if (!item.gameId) return;

            try {
                const response: Response = await fetch(
                    `https://www.cheapshark.com/api/1.0/games?id=${encodeURIComponent(item.gameId)}`
                );

                if (!response.ok) {
                    console.error(`CheapShark fout voor game ${item.gameId}:`, response.statusText);
                    return;
                }

                const gameDetail: CheapSharkGameDetail = await response.json() as CheapSharkGameDetail;

                if (gameDetail.deals && gameDetail.deals.length > 0) {
                    // Find the cheapest current deal
                    const cheapest: CheapSharkGameDeal = gameDetail.deals.reduce(
                        (min: CheapSharkGameDeal, deal: CheapSharkGameDeal) =>
                            parseFloat(deal.price) < parseFloat(min.price) ? deal : min,
                        gameDetail.deals[0]
                    );

                    const salePrice: number = parseFloat(cheapest.price);
                    const retailPrice: number = parseFloat(cheapest.retailPrice);
                    const savings: number = parseFloat(cheapest.savings);

                    this._prices[item.gameId] = { salePrice, retailPrice, savings };
                }
            }
            catch (error) {
                console.error(`Fout bij ophalen prijs voor game ${item.gameId}:`, error);
            }
        });

        await Promise.all(pricePromises);

        this._isLoading = false;
        this.render();
    }

    /**
     * Get the current price for a cart item.
     * Uses the live CheapShark price if available, falls back to localStorage.
     */
    private getPrice(item: CartItem): ResolvedPrice {
        const live: ResolvedPrice | undefined = this._prices[item.gameId];

        if (live) {
            return live;
        }

        // Fallback to localStorage price (no discount info available)
        return {
            salePrice: item.price,
            retailPrice: item.price,
            savings: 0,
        };
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = "";

        const items: CartItem[] = this._cartService.getCartItems();

        // Calculate totals using live prices
        let subtotal: number = 0;

        for (const item of items) {
            subtotal += this.getPrice(item).salePrice * item.quantity;
        }

        const discount: number = 0; // Placeholder for discount logic
        const total: number = subtotal - discount;

        // Build tiles HTML
        let tilesHTML: string = "";

        if (this._isLoading && items.length > 0) {
            tilesHTML = "<p class=\"loading-text\">Prijzen ophalen van CheapShark...</p>";
        }
        else if (items.length === 0) {
            tilesHTML = "<p class=\"empty-cart\">Je winkelwagen is leeg.</p>";
        }
        else {
            for (const item of items) {
                const priceData: ResolvedPrice = this.getPrice(item);

                tilesHTML += `
                    <payment-tile
                        game-id="${item.gameId}"
                        game-title="${item.title}"
                        game-image="${item.thumbnail}"
                        game-price="${priceData.salePrice.toFixed(2)}"
                        game-original-price="${priceData.retailPrice.toFixed(2)}"
                        game-savings="${priceData.savings.toFixed(0)}"
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
                    <p>${this._isLoading ? "Laden..." : "$" + subtotal.toFixed(2)}</p>
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
                    <p>${this._isLoading ? "Laden..." : "$" + total.toFixed(2)}</p>
                </div>
            </div>
            ${items.length > 0 && !this._isLoading
                ? "<a class=\"checkout\" id=\"checkoutBtn\">Afrekenen</a>"
                : ""}
        </div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/wwwroot/assets/css/paymentPage.css");

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
                this._prices = {};
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

                // Map cart items to CheckoutItem format using live prices
                const checkoutItems: CheckoutItem[] = cartItems.map((item: CartItem) => ({
                    name: item.title,
                    price: this.getPrice(item).salePrice,
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
