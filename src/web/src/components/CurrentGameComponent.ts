import { GameDetailResult, StoreDeal } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { GamePageData, getGamePageData } from "@web/services/CurrentGameService";
import { ShoppingCartService } from "@web/services/ShoppingCartService";

/**
 * Class for the current game page, extends HTMLElement.
 * Displays a full webshop product page with price, ratings,
 * deals across stores, and reviews.
 * Now uses Steam Store API + SteamSpy data instead of CheapShark.
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

        // Cheapest price ever (not available with Steam-only data, but kept for future GG.deals integration)
        let cheapestEverHTML: string = "";
        const cheapestEver: GameDetailResult["cheapestPriceEver"] = pageData.game.cheapestPriceEver;
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
     * Build the store deals HTML section.
     * Since we now use Steam-only pricing, this section links directly to
     * the Steam store page instead of CheapShark redirect URLs.
     *
     * @param storeDeals Array of store deals
     * @param steamUrl The Steam store page URL for this game
     * @returns HTML string for the deals table
     */
    private buildStoreDealsHTML(storeDeals: StoreDeal[], steamUrl: string): string {
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
                    <a href="${steamUrl}" target="_blank" rel="noopener noreferrer" class="deal-buy-btn">
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
                ? `<a href="${metacriticLink}" target="_blank" rel="noopener noreferrer" class="metacritic-link">Bekijk op Metacritic</a>`
                : "";

            sections.push(`
                <div class="rating-card metacritic-card">
                    <div class="metacritic-badge" style="background-color: ${color};">
                        ${game.metacriticScore}
                    </div>
                    <div class="rating-info">
                        <span class="rating-label">Metacritic Score</span>
                        ${metacriticLinkHTML}
                    </div>
                </div>
            `);
        }

        // Steam rating (now derived from SteamSpy positive/negative counts)
        if (game.steamRatingText && game.steamRatingText !== "No Reviews") {
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
            styleLink.setAttribute("href", "/assets/css/currentGame.css");
            this.shadowRoot.appendChild(styleLink);
            const descriptionImages: NodeListOf<HTMLImageElement> = this.shadowRoot.querySelectorAll(".game-description img");
            descriptionImages.forEach((img: HTMLImageElement): void => {
                img.removeAttribute("width");
                img.removeAttribute("height");
            });
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

        // Store URL link (now always points to Steam)
        const storeLink: string = currentGame.url
            ? `<a href="${currentGame.url}" target="_blank" rel="noopener noreferrer" class="store-link">
                    Bekijk op Steam &#8599;
               </a>`
            : "";

        // Build sub-sections
        const priceBoxHTML: string = this.buildPriceBoxHTML(pageData);
        const ratingsHTML: string = this.buildRatingsHTML(currentGame);
        const storeDealsHTML: string = currentGame.storeDeals
            ? this.buildStoreDealsHTML(currentGame.storeDeals, currentGame.url)
            : "";

        // Build reviews section
        const reviewsHTML: string = currentGame.reviews && currentGame.reviews.length > 0
            ? currentGame.reviews.map((review: string) => `<p class="review-item">${review}</p>`).join("")
            : "<p class=\"no-reviews\">Geen reviews beschikbaar.</p>";

        // Build description section
        const descriptionHTML: string = currentGame.descriptionHtml
            ? `<div class="game-detail-section">
                    <h2 class="section-title">Beschrijving</h2>
                    <div class="game-description">${currentGame.descriptionHtml}</div>
               </div>`
            : "";

        // Build tags section
        const tagsHTML: string = currentGame.tags && currentGame.tags.length > 0
            ? `<div class="game-tags">
                    ${currentGame.tags.map((tag: string) => `<span class="tag-badge">${tag}</span>`).join("")}
               </div>`
            : "";

        // Build screenshots section
        const screenshotsHTML: string = currentGame.images && currentGame.images.length > 0
            ? `<div class="game-detail-section">
                    <h2 class="section-title">Screenshots</h2>
                    <div class="screenshots-grid">
                        ${currentGame.images.slice(0, 4).map((img: string) =>
                            `<img src="${img}" alt="Screenshot" class="screenshot-thumb" loading="lazy">`
            ).join("")}
                    </div>
               </div>`
            : "";

        element = html`
            <div class="game-detail-page">
                <a href="/browse.html" class="back-link">&larr; Terug naar de winkel</a>

                <div class="game-detail-main">
                    <!-- Left column: Image + price -->
                    <div class="game-detail-left">
                        <div class="game-thumbnail-wrapper">
                            <img src="${currentGame.thumbnail}" alt="${currentGame.title}" class="game-thumbnail">
                        </div>

                        <!-- Price box -->
                        ${priceBoxHTML}

                        <!-- Buy & wishlist buttons -->
                        <div class="game-actions">
                            <button id="currentGameBuyButton" class="btn-buy">
                                <img src="/assets/img/icons/ShoppingCart.svg" alt="Cart" class="btn-cart-icon">
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

                        <!-- Tags -->
                        ${tagsHTML}

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

                <!-- Screenshots section -->
                ${screenshotsHTML}

                <!-- Description section (Steam HTML) -->
                ${descriptionHTML}

                <!-- Deals comparison section (only if storeDeals available) -->
                ${storeDealsHTML}
            </div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/currentGame.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);

        // Attach event listeners
        const buyButton: HTMLButtonElement | null = this.shadowRoot.querySelector("#currentGameBuyButton");
        if (buyButton) {
            buyButton.addEventListener("click", (): void => {
                const cartService: ShoppingCartService = new ShoppingCartService();

                // Use the Steam App ID as the game identifier
                const gameId: string = currentGame.gameId || currentGame.steamAppId || "";
                const title: string = currentGame.title || "Onbekend spel";
                const thumbnail: string = currentGame.thumbnail || "";
                const price: number = pageData.currentPrice ?? 0;

                const success: boolean = cartService.addToCart(gameId, title, thumbnail, price);
                window.dispatchEvent(new CustomEvent("cart-updated"));

                if (success) {
                    buyButton.textContent = "✓ Toegevoegd!";
                    buyButton.style.backgroundColor = "#2ecc71";

                    setTimeout((): void => {
                        buyButton.innerHTML = "<img src=\"/assets/img/icons/ShoppingCart.svg\" alt=\"Cart\" class=\"btn-cart-icon\"> In winkelwagen";
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

        // Screenshot lightbox — appended to document.body so it renders
        // on top of everything (outside Shadow DOM), like Steam's overlay.
        const screenshotThumbs: NodeListOf<HTMLImageElement> = this.shadowRoot.querySelectorAll(".screenshot-thumb");

        if (screenshotThumbs.length > 0) {
            const images: string[] = Array.from(screenshotThumbs).map((img: HTMLImageElement) => img.src);
            const totalImages: number = images.length;
            let currentIndex: number = 0;

            // Create the lightbox element and inject scoped styles into body
            const lightbox: HTMLDivElement = document.createElement("div");
            lightbox.id = "game-screenshot-lightbox";
            lightbox.innerHTML = `
                <style>
                    #game-screenshot-lightbox {
                        display: none;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        z-index: 99999;
                        background-color: rgba(0, 0, 0, 0.92);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        align-items: center;
                        justify-content: center;
                        cursor: zoom-out;
                        animation: lb-fade-in 0.2s ease;
                    }

                    #game-screenshot-lightbox.active {
                        display: flex;
                    }

                    @keyframes lb-fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    @keyframes lb-zoom-in {
                        from { transform: scale(0.92); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }

                    #game-screenshot-lightbox .lb-image {
                        max-width: 90vw;
                        max-height: 85vh;
                        object-fit: contain;
                        border-radius: 4px;
                        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
                        animation: lb-zoom-in 0.25s ease;
                        cursor: default;
                    }

                    #game-screenshot-lightbox .lb-close {
                        position: absolute;
                        top: 16px;
                        right: 24px;
                        background: rgba(255, 255, 255, 0.08);
                        border: none;
                        color: #fff;
                        font-size: 1.6rem;
                        font-weight: 300;
                        cursor: pointer;
                        line-height: 1;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 6px;
                        transition: background-color 0.2s ease;
                    }

                    #game-screenshot-lightbox .lb-close:hover {
                        background-color: rgba(255, 255, 255, 0.18);
                    }

                    #game-screenshot-lightbox .lb-nav {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        background: rgba(255, 255, 255, 0.08);
                        border: none;
                        color: #fff;
                        font-size: 2rem;
                        font-weight: 300;
                        cursor: pointer;
                        width: 48px;
                        height: 64px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 6px;
                        transition: background-color 0.2s ease;
                        user-select: none;
                    }

                    #game-screenshot-lightbox .lb-nav:hover {
                        background-color: rgba(255, 255, 255, 0.18);
                    }

                    #game-screenshot-lightbox .lb-prev {
                        left: 16px;
                    }

                    #game-screenshot-lightbox .lb-next {
                        right: 16px;
                    }

                    #game-screenshot-lightbox .lb-counter {
                        position: absolute;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        color: rgba(255, 255, 255, 0.6);
                        font-family: sans-serif;
                        font-size: 0.85rem;
                        font-weight: 600;
                        letter-spacing: 0.05em;
                    }
                </style>
                <button class="lb-close">&times;</button>
                <button class="lb-nav lb-prev">&#8249;</button>
                <button class="lb-nav lb-next">&#8250;</button>
                <img class="lb-image" src="" alt="Screenshot">
                <span class="lb-counter"></span>
            `;

            document.body.appendChild(lightbox);

            const lbImage: HTMLImageElement = lightbox.querySelector(".lb-image") as HTMLImageElement;
            const lbCounter: HTMLElement = lightbox.querySelector(".lb-counter") as HTMLElement;
            const lbClose: HTMLElement = lightbox.querySelector(".lb-close") as HTMLElement;
            const lbPrev: HTMLElement = lightbox.querySelector(".lb-prev") as HTMLElement;
            const lbNext: HTMLElement = lightbox.querySelector(".lb-next") as HTMLElement;

            function showImage(index: number): void {
                currentIndex = index;
                lbImage.src = images[currentIndex];
                lbCounter.textContent = `${currentIndex + 1} / ${totalImages}`;
            };

            function openLightbox(index: number): void {
                showImage(index);
                lightbox.classList.add("active");
                document.body.style.overflow = "hidden";
            };

            function closeLightbox(): void {
                lightbox.classList.remove("active");
                document.body.style.overflow = "";
            };

            // Open on thumbnail click
            screenshotThumbs.forEach((thumb: HTMLImageElement, index: number) => {
                thumb.addEventListener("click", (): void => {
                    openLightbox(index);
                });
            });

            // Close button
            lbClose.addEventListener("click", (e: Event): void => {
                e.stopPropagation();
                closeLightbox();
            });

            // Click backdrop to close
            lightbox.addEventListener("click", (e: Event): void => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            // Prev / Next
            lbPrev.addEventListener("click", (e: Event): void => {
                e.stopPropagation();
                showImage((currentIndex - 1 + totalImages) % totalImages);
            });

            lbNext.addEventListener("click", (e: Event): void => {
                e.stopPropagation();
                showImage((currentIndex + 1) % totalImages);
            });

            // Keyboard: Escape, ArrowLeft, ArrowRight
            const handleKeyDown: (e: KeyboardEvent) => void = (e: KeyboardEvent): void => {
                if (!lightbox.classList.contains("active")) return;

                if (e.key === "Escape")
                    closeLightbox();
                else if (e.key === "ArrowLeft")
                    showImage((currentIndex - 1 + totalImages) % totalImages);
                else if (e.key === "ArrowRight")
                    showImage((currentIndex + 1) % totalImages);
            };

            document.addEventListener("keydown", handleKeyDown);
        }
    }
}

window.customElements.define("webshop-currentgame", CurrentGameComponent);
