import { GameDetailResult, StoreDeal } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { GamePageData, getGamePageData } from "@web/services/CurrentGameService";
import { ShoppingCartService } from "@web/services/ShoppingCartService";

/**
 * Class for the current game page, extends HTMLElement.
 * Displays a full webshop product page with price, ratings,
 * deals across stores, and reviews.
 */
export class CurrentGameComponent extends HTMLElement {
    /**
     * Attach the Shadow and render the HTML
     */
    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        await this.render();
    }

    /**
     * Format a Unix timestamp to a readable date string
     *
     * @param timestamp Unix timestamp in seconds
     * @returns Formatted date string
     */
    private formatDate(timestamp: number): string {
        if (!timestamp || timestamp <= 0) {
            return "Onbekend";
        }
        const date: Date = new Date(timestamp * 1000);
        return date.toLocaleDateString("nl-NL", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    /**
     * Get the CSS color for a metacritic score badge
     *
     * @param score The metacritic score as a string
     * @returns CSS color string
     */
    private getMetacriticColor(score: string): string {
        const numScore: number = parseInt(score);
        if (numScore >= 75) {
            return "#6c3";
        }
        if (numScore >= 50) {
            return "#fc3";
        }
        return "#f00";
    }

    /**
     * Get the CSS color for a Steam rating
     *
     * @param ratingText The Steam rating text
     * @returns CSS color string
     */
    private getSteamRatingColor(ratingText: string): string {
        const lower: string = ratingText.toLowerCase();
        if (lower.includes("overwhelmingly positive") || lower.includes("very positive")) {
            return "#1C2594";
        }
        if (lower.includes("positive") || lower.includes("mostly positive")) {
            return "#2e7d32";
        }
        if (lower.includes("mixed")) {
            return "#b8860b";
        }
        return "#c0392b";
    }

    /**
     * Build the price box HTML using the resolved price data
     *
     * @param pageData The game page data with price info
     * @returns HTML string for the price box
     */
    private buildPriceBoxHTML(pageData: GamePageData): string {
        const currentPrice: number | null = pageData.currentPrice;
        const retailPrice: number | null = pageData.retailPrice;
        const savingsPercent: number | null = pageData.savingsPercent;
        const game: GameDetailResult = pageData.game;

        if (currentPrice === null) {
            return `
                <div class="price-box">
                    <div class="price-row">
                        <span class="price-current">Prijs niet beschikbaar</span>
                    </div>
                </div>
            `;
        }

        const isFree: boolean = currentPrice === 0;
        const isOnSale: boolean = savingsPercent !== null && savingsPercent > 0;
        const finalPrice: number = isOnSale
            ? retailPrice! * (1 - savingsPercent! / 100)
            : currentPrice;
        const priceText: string = isFree ? "Gratis" : `€${finalPrice.toFixed(2)}`;
        const freeClass: string = isFree ? " free" : "";

        const discountBadge: string = isOnSale
            ? `<span class="price-discount-badge">-${Math.round(savingsPercent as number)}%</span>`
            : "";

        const originalPriceHTML: string = isOnSale && retailPrice !== null
            ? `<span class="price-original">€${retailPrice.toFixed(2)}</span>`
            : "";

        // Cheapest price ever
        let cheapestEverHTML: string = "";
        const cheapestEver: GameDetailResult["cheapestPriceEver"] = game.cheapestPriceEver;
        if (cheapestEver) {
            const cheapestEverPrice: number = parseFloat(cheapestEver.price);
            const cheapestEverText: string = cheapestEverPrice === 0
                ? "Gratis"
                : `€${cheapestEverPrice.toFixed(2)}`;
            const cheapestEverDate: string = this.formatDate(cheapestEver.date);
            cheapestEverHTML = `
                <p class="price-cheapest-ever">
                    Laagste prijs ooit: <strong>${cheapestEverText}</strong> op ${cheapestEverDate}
                </p>
            `;
        }

        return `
            <div class="price-box">
                <div class="price-row">
                    ${discountBadge}
                    ${originalPriceHTML}
                    <span class="price-current${freeClass}">${priceText}</span>
                </div>
                ${cheapestEverHTML}
            </div>
        `;
    }

    /**
     * Build the store deals HTML section
     *
     * @param storeDeals Array of store deals
     * @returns HTML string for the deals table
     */
    private buildStoreDealsHTML(storeDeals: StoreDeal[]): string {
        if (storeDeals.length === 0) {
            return "";
        }

        // Sort by price ascending
        const sorted: StoreDeal[] = [...storeDeals].sort(
            (a: StoreDeal, b: StoreDeal) => parseFloat(a.price) - parseFloat(b.price)
        );

        const rows: string = sorted.map((deal: StoreDeal) => {
            const savings: number = parseFloat(deal.savings);
            const savingsDisplay: string = savings > 0
                ? `<span class="deal-savings">-${Math.round(savings)}%</span>`
                : "";
            const price: number = parseFloat(deal.price);
            const priceDisplay: string = price === 0
                ? "<span class=\"deal-price free\">Gratis</span>"
                : `<span class="deal-price">€${price.toFixed(2)}</span>`;
            const retail: number = parseFloat(deal.retailPrice);
            const retailDisplay: string = savings > 0
                ? `<span class="deal-retail">€${retail.toFixed(2)}</span>`
                : "";

            return `
                <div class="deal-row">
                    <div class="deal-store">
                        <img src="${deal.storeIcon}" alt="${deal.storeName}" class="store-icon" onerror="this.style.display='none'">
                        <span class="store-name">${deal.storeName}</span>
                    </div>
                    <div class="deal-pricing">
                        ${savingsDisplay}
                        ${retailDisplay}
                        ${priceDisplay}
                    </div>
                    <a href="https://www.cheapshark.com/redirect?dealID=${deal.dealID}" target="_blank" rel="noopener noreferrer" class="deal-buy-btn">
                        Bekijk deal
                    </a>
                </div>
            `;
        }).join("");

        return `
            <div class="game-detail-section">
                <h2 class="section-title">Prijzen vergelijken</h2>
                <div class="deals-list">${rows}</div>
            </div>
        `;
    }

    /**
     * Build the ratings section HTML
     *
     * @param game The game detail result
     * @returns HTML string for ratings
     */
    private buildRatingsHTML(game: GameDetailResult): string {
        const sections: string[] = [];

        // Metacritic score
        if (game.metacriticScore && game.metacriticScore !== "0") {
            const color: string = this.getMetacriticColor(game.metacriticScore);
            const metacriticLink: string | null = game.metacriticLink;
            const metacriticLinkHTML: string = metacriticLink
                ? `<a href="https://www.metacritic.com${metacriticLink}" target="_blank" rel="noopener noreferrer" class="metacritic-link">Bekijk op Metacritic &rarr;</a>`
                : "";

            sections.push(`
                <div class="rating-card metacritic-card">
                    <div class="rating-badge" style="background-color: ${color};">
                        ${game.metacriticScore}
                    </div>
                    <div class="rating-info">
                        <span class="rating-label">Metacritic Score</span>
                        ${metacriticLinkHTML}
                    </div>
                </div>
            `);
        }

        // Steam rating
        if (game.steamRatingText) {
            const color: string = this.getSteamRatingColor(game.steamRatingText);
            const percentText: string = game.steamRatingPercent
                ? ` (${game.steamRatingPercent}%)`
                : "";
            const ratingCount: string = game.steamRatingCount
                ? parseInt(game.steamRatingCount).toLocaleString("nl-NL")
                : "";
            const countText: string = ratingCount.length > 0
                ? ` van ${ratingCount} beoordelingen`
                : "";

            sections.push(`
                <div class="rating-card steam-card">
                    <div class="steam-rating-icon" style="color: ${color};">
                        &#9733;
                    </div>
                    <div class="rating-info">
                        <span class="rating-label" style="color: ${color};">${game.steamRatingText}${percentText}</span>
                        <span class="rating-count">${countText}</span>
                    </div>
                </div>
            `);
        }

        if (sections.length === 0) {
            return "";
        }

        return `
            <div class="ratings-section">
                <h2 class="section-title">Beoordelingen</h2>
                <div class="ratings-container">${sections.join("")}</div>
            </div>
        `;
    }

    /**
     * Render the HTML of the current game page
     *
     * @returns Void
     */
    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const pageData: GamePageData | null = await getGamePageData();
        let element: HTMLElement;

        // Checks if game exists
        if (!pageData) {
            element = html`
                <div class="game-not-found">
                    <h2>Game niet gevonden</h2>
                    <p>Het spel dat je zoekt bestaat niet of kon niet worden geladen.</p>
                    <a href="/" class="back-link">&larr; Terug naar de winkel</a>
                </div>
            `;

            this.shadowRoot.firstChild?.remove();
            this.shadowRoot.append(element);

            const styleLink: HTMLLinkElement = document.createElement("link");
            styleLink.setAttribute("rel", "stylesheet");
            styleLink.setAttribute("href", "/wwwroot/assets/css/currentGame.css");
            this.shadowRoot.appendChild(styleLink);
            return;
        }

        const currentGame: GameDetailResult = pageData.game;

        // Publisher / developer info
        const hasAuthors: boolean = currentGame.authors !== null && currentGame.authors.length > 0;
        const publisher: string = hasAuthors
            ? (currentGame.authors as string[]).join(", ")
            : "Onbekend";

        // Release date
        const releaseDate: string = currentGame.releaseDate
            ? this.formatDate(currentGame.releaseDate)
            : "Onbekend";

        // Store URL link
        const storeLink: string = currentGame.url
            ? `<a href="${currentGame.url}" target="_blank" rel="noopener noreferrer" class="store-page-link">Bekijk op Steam &rarr;</a>`
            : "";

        // Price box HTML (uses fetched price data)
        const priceBoxHTML: string = this.buildPriceBoxHTML(pageData);

        // Ratings HTML
        const ratingsHTML: string = this.buildRatingsHTML(currentGame);

        // Store deals HTML
        const storeDealsList: StoreDeal[] = currentGame.storeDeals || [];
        const storeDealsHTML: string = this.buildStoreDealsHTML(storeDealsList);

        // Reviews section
        const hasReviews: boolean = currentGame.reviews !== null && currentGame.reviews.length > 0;
        let reviewsHTML: string = "<p class=\"no-reviews\">Er zijn nog geen reviews beschikbaar.</p>";
        if (hasReviews) {
            reviewsHTML = (currentGame.reviews as string[])
                .map((review: string) => `<div class="review-item">${review}</div>`)
                .join("");
        }

        element = html`
            <div class="game-detail-page">
                <!-- Back navigation -->
                <a href="/" class="back-link">&larr; Terug naar de winkel</a>

                <!-- Main content area -->
                <div class="game-detail-main">
                    <!-- Left column: Image, price, actions -->
                    <div class="game-detail-left">
                        <div class="game-thumbnail-wrapper">
                            <img src="${currentGame.thumbnail}" alt="${currentGame.title}" class="game-thumbnail">
                        </div>

                        <!-- Price box -->
                        ${priceBoxHTML}

                        <!-- Buy & wishlist buttons -->
                        <div class="game-actions">
                            <button id="currentGameBuyButton" class="btn-buy">
                                <span class="btn-icon">&#128722;</span>
                                In winkelwagen
                            </button>
                            <button id="currentGameHeartButton" class="btn-wishlist">
                                <span class="btn-icon">&#9825;</span>
                                Verlanglijst
                            </button>
                        </div>

                        ${storeLink}
                    </div>

                    <!-- Right column: Game info -->
                    <div class="game-detail-right">
                        <h1 class="game-title">${currentGame.title}</h1>

                        <!-- Game metadata -->
                        <div class="game-meta">
                            <div class="meta-item">
                                <span class="meta-label">Uitgever</span>
                                <span class="meta-value">${publisher}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Releasedatum</span>
                                <span class="meta-value">${releaseDate}</span>
                            </div>
                        </div>

                        <!-- Ratings section -->
                        ${ratingsHTML}

                        <!-- Reviews section -->
                        <div class="game-detail-section">
                            <h2 class="section-title">Reviews</h2>
                            <div class="reviews-container">
                                ${reviewsHTML}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Deals comparison section (only if storeDeals available) -->
                ${storeDealsHTML}
            </div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/wwwroot/assets/css/currentGame.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);

        // Attach event listeners
        const buyButton: HTMLButtonElement | null = this.shadowRoot.querySelector("#currentGameBuyButton");
        if (buyButton) {
            buyButton.addEventListener("click", (): void => {
                const cartService: ShoppingCartService = new ShoppingCartService();

                // Use the game data already fetched for this page
                const gameId: string = currentGame.gameId || currentGame.cheapSharkGameId || "";
                const title: string = currentGame.title || "Onbekend spel";
                const thumbnail: string = currentGame.thumbnail || "";
                const price: number = pageData.currentPrice ?? 0;

                const success: boolean = cartService.addToCart(gameId, title, thumbnail, price);
                window.dispatchEvent(new CustomEvent("cart-updated"));

                if (success) {
                    buyButton.textContent = "✓ Toegevoegd!";
                    buyButton.style.backgroundColor = "#2ecc71";

                    setTimeout((): void => {
                        buyButton.innerHTML = "<span class=\"btn-icon\">&#128722;</span> In winkelwagen";
                        buyButton.style.backgroundColor = "";
                    }, 1500);
                }
            });
        }

        const heartButton: HTMLButtonElement | null = this.shadowRoot.querySelector("#currentGameHeartButton");
        if (heartButton) {
            heartButton.addEventListener("click", (): void => {
                heartButton.classList.toggle("wishlisted");
                const icon: HTMLSpanElement | null = heartButton.querySelector(".btn-icon");
                if (icon) {
                    const isWishlisted: boolean = heartButton.classList.contains("wishlisted");
                    icon.innerHTML = isWishlisted ? "&#9829;" : "&#9825;";
                }
            });
        }
    }
}

window.customElements.define("webshop-currentgame", CurrentGameComponent);
