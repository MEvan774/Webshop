import { html } from "@web/helpers/webComponents";
import { FavoritesService } from "@web/services/FavoritesService";
import { ShoppingCartService } from "@web/services/ShoppingCartService";

/**
 * A single favorites tile for the favorites/wishlist page.
 * Displays game thumbnail, title, and action buttons (add to cart, remove).
 *
 * Attributes:
 * - game-id:    The CheapShark game ID
 * - game-title: Display title
 * - game-image: Thumbnail URL
 */
export class FavoritesTileComponent extends HTMLElement {
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

        const element: HTMLElement = html`
        <div class="favoriteTile">
            <a href="/currentGame.html?gameId=${gameId}" class="tile-link">
                <img class="tile-image" src="${image}" alt="${title}">
            </a>
            <div class="tile-content">
                <a href="/currentGame.html?gameId=${gameId}" class="tile-title-link">
                    <p class="tile-title">${title}</p>
                </a>
            </div>
            <div class="tile-actions">
                <button class="btn-cart" id="addToCart" title="Toevoegen aan winkelwagen">
                    <img class="btn-icon" src="/assets/img/icons/ShoppingCart.svg" width="16" height="16" alt="Winkelwagen" />
                </button>
                <button class="btn-remove" id="removeFromFavorites" title="Verwijderen uit verlanglijst">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        `;

        const style: HTMLStyleElement = document.createElement("style");
        style.textContent = `
            .favoriteTile {
                display: grid;
                grid-template-columns: 100px 1fr auto;
                align-items: center;
                gap: 16px;
                background: #fff;
                border: 2px solid #e0d6c6;
                border-radius: 10px;
                padding: 12px;
                margin-bottom: 10px;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
            }

            .favoriteTile:hover {
                border-color: #1C2594;
                box-shadow: 0 2px 12px rgba(28, 37, 148, 0.08);
            }

            .tile-link {
                display: block;
            }

            .tile-image {
                width: 100px;
                height: 60px;
                object-fit: cover;
                border-radius: 6px;
                background-color: #e0d6c6;
            }

            .tile-content {
                display: flex;
                flex-direction: column;
                gap: 4px;
                min-width: 0;
            }

            .tile-title-link {
                text-decoration: none;
                color: inherit;
            }

            .tile-title-link:hover .tile-title {
                color: #1C2594;
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
                transition: color 0.15s ease;
            }

            .tile-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .btn-cart {
                background: linear-gradient(90deg, #1C2594, #5BCAF3);
                border: none;
                color: #fff;
                cursor: pointer;
                padding: 8px 14px;
                border-radius: 8px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 4px;
                transition: transform 0.15s ease, box-shadow 0.15s ease;
            }

            .btn-cart:hover {
                transform: translateY(-1px);
                box-shadow: 0 3px 10px rgba(28, 37, 148, 0.3);
            }

            .btn-cart .btn-icon {
                font-size: 1.1rem;
            }

            .btn-remove {
                background: none;
                border: 2px solid #e0d6c6;
                color: #999;
                cursor: pointer;
                padding: 7px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s ease;
            }

            .btn-remove:hover {
                border-color: #e74c3c;
                color: #e74c3c;
                background-color: #fdf2f2;
            }

            @media (max-width: 520px) {
                .favoriteTile {
                    grid-template-columns: 72px 1fr auto;
                    gap: 10px;
                    padding: 10px;
                }

                .tile-image {
                    width: 72px;
                    height: 48px;
                }

                .tile-title {
                    font-size: 0.9rem;
                }
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.append(element);

        // Add to cart button
        const cartButton: HTMLButtonElement | null = this.shadowRoot.querySelector("#addToCart");

        if (cartButton) {
            cartButton.addEventListener("click", (): void => {
                const cartService: ShoppingCartService = new ShoppingCartService();
                cartService.addToCart(gameId, title, image, 0);

                // Notify the navbar to update cart badge
                window.dispatchEvent(new CustomEvent("cart-updated"));

                // Brief visual feedback
                cartButton.style.background = "#2ecc71";
                setTimeout((): void => {
                    cartButton.style.background = "linear-gradient(90deg, #1C2594, #5BCAF3)";
                }, 600);
            });
        }

        // Remove from favorites button
        const removeButton: HTMLButtonElement | null = this.shadowRoot.querySelector("#removeFromFavorites");

        if (removeButton) {
            removeButton.addEventListener("click", (): void => {
                const favoritesService: FavoritesService = new FavoritesService();
                favoritesService.removeFromFavorites(gameId);

                // Dispatch event so FavoritesComponent re-renders
                this.dispatchEvent(new CustomEvent("favorites-updated", { bubbles: true, composed: true }));
            });
        }
    }
}

window.customElements.define("favorites-tile", FavoritesTileComponent);
