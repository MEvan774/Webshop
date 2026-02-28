import { html } from "@web/helpers/webComponents";
import { ShoppingCartService } from "@web/services/ShoppingCartService";

/**
 * A single cart-item tile for the payment page.
 * Displays game info with live prices from CheapShark.
 */
export class PaymentTileComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = "";

        const gameId: string = this.getAttribute("game-id") || "";
        const title: string = this.getAttribute("game-title") || "Onbekend spel";
        const image: string = this.getAttribute("game-image") || "/assets/img/temp/Frontpage.png";
        const price: number = parseFloat(this.getAttribute("game-price") || "0");
        const originalPrice: number = parseFloat(this.getAttribute("game-original-price") || "0");
        const savings: number = parseFloat(this.getAttribute("game-savings") || "0");
        const quantity: number = parseInt(this.getAttribute("game-qty") || "1");
        const lineTotal: string = (price * quantity).toFixed(2);

        // Build price display
        let priceHTML: string = "";

        if (savings > 0 && originalPrice > price) {
            priceHTML = `
                <div class="price-info">
                    <span class="savings-badge">-${Math.round(savings)}%</span>
                    <span class="original-price">$${originalPrice.toFixed(2)}</span>
                    <span class="sale-price">$${price.toFixed(2)}</span>
                </div>
            `;
        }
        else {
            priceHTML = `
                <div class="price-info">
                    <span class="sale-price">$${price.toFixed(2)}</span>
                </div>
            `;
        }

        const element: HTMLElement = html`
        <div class="gameTile">
            <img class="tile-image" src="${image}" alt="${title}">
            <div class="tile-content">
                <p class="tile-title">${title}</p>
                ${priceHTML}
                <p class="tile-qty">${quantity > 1 ? `${quantity}× — Totaal: $${lineTotal}` : ""}</p>
            </div>
            <div class="tile-total">
                <p>$${lineTotal}</p>
            </div>
            <button class="tile-remove" id="trash" title="Verwijderen">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        </div>
        `;

        const style: HTMLStyleElement = document.createElement("style");
        style.textContent = `
            :host {
                display: block;
                margin-bottom: 10px;
            }

            .gameTile {
                display: grid;
                grid-template-columns: 100px 1fr auto auto;
                align-items: center;
                gap: 16px;
                background-color: #FFFAF0;
                border: 1px solid #e0d6c6;
                border-radius: 10px;
                padding: 12px;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
            }

            .gameTile:hover {
                border-color: #1C2594;
                box-shadow: 0 2px 12px rgba(28, 37, 148, 0.08);
            }

            .tile-image {
                width: 100px;
                height: 68px;
                object-fit: cover;
                border-radius: 6px;
                background-color: #e8e0d4;
            }

            .tile-content {
                display: flex;
                flex-direction: column;
                gap: 4px;
                min-width: 0;
            }

            .tile-title {
                font-family: 'TimesNewRoman', serif;
                font-size: 1rem;
                font-weight: bold;
                color: #1B1212;
                margin: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .price-info {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
            }

            .savings-badge {
                background-color: #2ecc71;
                color: #fff;
                font-size: 0.7rem;
                font-weight: 700;
                padding: 2px 7px;
                border-radius: 4px;
                font-family: 'Raleway', sans-serif;
            }

            .original-price {
                text-decoration: line-through;
                color: #aaa;
                font-size: 0.85rem;
            }

            .sale-price {
                color: #1C2594;
                font-size: 1rem;
                font-weight: 700;
                font-family: 'TimesNewRoman', serif;
            }

            .tile-qty {
                font-size: 0.78rem;
                color: #888;
                margin: 0;
                font-family: 'Raleway', sans-serif;
            }

            .tile-total {
                text-align: right;
            }

            .tile-total p {
                margin: 0;
                font-family: 'TimesNewRoman', serif;
                font-size: 1.15rem;
                font-weight: bold;
                color: #1C2594;
            }

            .tile-remove {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                border: none;
                background: none;
                color: #bbb;
                cursor: pointer;
                border-radius: 8px;
                transition: color 0.2s ease, background-color 0.2s ease;
            }

            .tile-remove:hover {
                color: #e74c3c;
                background-color: rgba(231, 76, 60, 0.08);
            }

            @media (max-width: 768px) {
                .gameTile {
                    grid-template-columns: 72px 1fr auto;
                    gap: 10px;
                    padding: 10px;
                }

                .tile-image {
                    width: 72px;
                    height: 52px;
                }

                .tile-total {
                    display: none;
                }

                .tile-title {
                    font-size: 0.9rem;
                }
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.append(element);

        // Remove this specific item from the cart and notify parent
        const trashButton: HTMLButtonElement | null = this.shadowRoot.querySelector("#trash");

        if (trashButton) {
            trashButton.addEventListener("click", (): void => {
                const cartService: ShoppingCartService = new ShoppingCartService();
                cartService.deleteFromCart(gameId);
                this.dispatchEvent(new CustomEvent("cart-updated", { bubbles: true, composed: true }));
            });
        }
    }
}

window.customElements.define("payment-tile", PaymentTileComponent);
