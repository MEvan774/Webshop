import { html } from "@web/helpers/webComponents";
import { ShoppingCartService } from "@web/services/ShoppingCartService";

/**
 * A single cart-item tile for the payment page.
 * Displays game info with live prices from CheapShark.
 *
 * Attributes:
 * - game-id:             The CheapShark game ID
 * - game-title:          Display title
 * - game-image:          Thumbnail URL
 * - game-price:          Current (sale) price per unit (USD)
 * - game-original-price: Original retail price per unit (USD)
 * - game-savings:        Savings percentage (e.g. "25" for 25% off)
 * - game-qty:            Quantity in the cart
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

        // Build price display — show original price with strikethrough if there's a discount
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
            <img id="gameImage" src="${image}" alt="${title}">
            <div class="tile-content">
                <p id="gameName">${title}</p>
                ${priceHTML}
                <p id="gameQty">${quantity > 1 ? `${quantity}× — Totaal: $${lineTotal}` : ""}</p>
            </div>
            <div id="gameTotal">
                <p>$${lineTotal}</p>
            </div>
            <div id="gameButtons">
                <button class="icon" id="trash">🗑️</button>
            </div>
        </div>
        `;

        const style: HTMLStyleElement = document.createElement("style");
        style.textContent = `
            .gameTile {
                display: grid;
                grid-template-columns: 100px 1fr auto auto;
                align-items: center;
                gap: 12px;
                border: 1px solid #1B1212;
                padding: 8px;
                margin-bottom: 8px;
            }

            #gameImage {
                width: 100%;
                height: 70px;
                object-fit: cover;
                border-right: 1px solid #1B1212;
            }

            .tile-content {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            #gameName {
                font-size: 16px;
                font-weight: bold;
                margin: 0;
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
                font-size: 12px;
                font-weight: 700;
                padding: 2px 6px;
                border-radius: 4px;
            }

            .original-price {
                text-decoration: line-through;
                color: #999;
                font-size: 14px;
            }

            .sale-price {
                color: #1B1212;
                font-size: 16px;
                font-weight: 600;
            }

            #gameQty {
                font-size: 12px;
                color: #666;
                margin: 0;
            }

            #gameTotal {
                font-size: 18px;
                font-weight: bold;
                text-align: right;
            }

            #gameTotal p {
                margin: 0;
            }

            #gameButtons {
                display: flex;
                align-items: center;
            }

            #gameButtons button {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 20px;
                padding: 4px 8px;
                border-radius: 4px;
                transition: background-color 0.15s ease;
            }

            #gameButtons button:hover {
                background-color: #f0e0e0;
            }

            @media (max-width: 768px) {
                .gameTile {
                    grid-template-columns: 80px 1fr auto;
                }

                #gameTotal {
                    display: none;
                }

                #gameImage {
                    height: 60px;
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

                // Dispatch event so PaymentComponent re-fetches prices and re-renders
                this.dispatchEvent(new CustomEvent("cart-updated", { bubbles: true, composed: true }));
            });
        }
    }
}

window.customElements.define("payment-tile", PaymentTileComponent);
