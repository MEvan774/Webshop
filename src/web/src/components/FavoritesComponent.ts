/* eslint-disable @stylistic/quotes */
import { html } from "@web/helpers/webComponents";
import "@web/components/FavoritesTileComponent";
import { FavoritesService, FavoriteItem } from "@web/services/FavoritesService";
import { ShoppingCartService } from "@web/services/ShoppingCartService";
import { AllGameService } from "@web/services/AllGamesService";
import { ProductPrice } from "@shared/types";

/**
 * Favorites page component.
 * Reads the favorites list from localStorage and renders each item
 * as a <favorites-tile>. Allows removing items and adding them to the cart.
 */
export class FavoritesComponent extends HTMLElement {
    private readonly _favoritesService: FavoritesService = new FavoritesService();
    private readonly _cartService: ShoppingCartService = new ShoppingCartService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // Re-render when a tile fires "favorites-updated" (item removed)
        this.addEventListener("favorites-updated", (): void => {
            this.render();
            // Notify the navbar to update the favorites badge
            window.dispatchEvent(new CustomEvent("favorites-updated"));
        });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = "";

        const items: FavoriteItem[] = this._favoritesService.getFavorites();

        // Build tiles HTML
        let tilesHTML: string = "";

        if (items.length === 0) {
            tilesHTML = `
                <div class="empty-state">
                    <div class="empty-icon">&#9825;</div>
                    <p class="empty-title">Je verlanglijst is leeg</p>
                    <p class="empty-subtitle">Voeg games toe aan je verlanglijst door op het hartje te klikken op een gamepagina.</p>
                    <a href="/browse.html" class="browse-link">Bekijk alle games</a>
                </div>
            `;
        }
        else {
            for (const item of items) {
                tilesHTML += `
                    <favorites-tile
                        game-id="${item.gameId}"
                        game-title="${item.title}"
                        game-image="${item.thumbnail}"
                    ></favorites-tile>
                `;
            }
        }

        const element: HTMLElement = html`
        <div id="favoritesContainer">
            <div id="favoritesList">
                <h1>Mijn verlanglijst</h1>
                <p class="favorites-count">${items.length} ${items.length === 1 ? "game" : "games"}</p>
                ${tilesHTML}
                ${items.length > 0 ? "<a id=\"removeAll\">Verwijder alle favorieten</a>" : ""}
            </div>
            <div id="actionsContainer">
                <div id="actionsBox">
                    <h2>Verlanglijst</h2>
                    <p class="action-count">${items.length} ${items.length === 1 ? "game" : "games"} opgeslagen</p>
                    ${items.length > 0
                        ? `<a class="add-all-btn" id="addAllToCart">Alles in winkelwagen</a>`
                        : ""}
                    <a class="browse-btn" href="/browse.html">Meer games ontdekken</a>
                </div>
            </div>
        </div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/favoritesPage.css");

        this.shadowRoot.appendChild(styleLink);
        this.shadowRoot.append(element);

        // --- Event listeners ---

        // "Remove all" link
        const removeAllLink: HTMLAnchorElement | null = this.shadowRoot.querySelector("#removeAll");

        if (removeAllLink) {
            removeAllLink.addEventListener("click", (): void => {
                this._favoritesService.removeAllFavorites();
                this.render();
                window.dispatchEvent(new CustomEvent("favorites-updated"));
            });
        }

        // "Add all to cart" button — now fetches real prices before adding
        const addAllBtn: HTMLAnchorElement | null = this.shadowRoot.querySelector("#addAllToCart");

        if (addAllBtn) {
            addAllBtn.addEventListener("click", async (): Promise<void> => {
                const favorites: FavoriteItem[] = this._favoritesService.getFavorites();

                if (favorites.length === 0) {
                    return;
                }

                // Disable button and show loading state
                addAllBtn.style.opacity = "0.6";
                addAllBtn.style.pointerEvents = "none";
                addAllBtn.textContent = "Prijzen ophalen...";

                try {
                    // Fetch prices for all favorited games in one batch
                    const gameIds: string[] = favorites.map((fav: FavoriteItem) => fav.gameId);
                    const gameService: AllGameService = new AllGameService();
                    const prices: Record<string, ProductPrice> | null = await gameService.getGamePrices(gameIds);

                    for (const fav of favorites) {
                        const price: number = prices?.[fav.gameId]?.price ?? 0;
                        this._cartService.addToCart(fav.gameId, fav.title, fav.thumbnail, price);
                    }

                    window.dispatchEvent(new CustomEvent("cart-updated"));
                    alert(`${favorites.length} ${favorites.length === 1 ? "game" : "games"} toegevoegd aan je winkelwagen!`);
                }
                catch (error) {
                    console.error("Fout bij ophalen prijzen:", error);
                    alert("Kon de prijzen niet ophalen. Probeer het opnieuw.");
                }
                finally {
                    // Restore button state
                    addAllBtn.style.opacity = "1";
                    addAllBtn.style.pointerEvents = "auto";
                    addAllBtn.textContent = "Alles in winkelwagen";
                }
            });
        }
    }
}

window.customElements.define("webshop-favorites", FavoritesComponent);
