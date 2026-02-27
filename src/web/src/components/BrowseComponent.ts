import { GameResult, ProductPrice } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { AllGameService } from "@web/services/AllGamesService";

/**
 * Component for browsing all available game deals.
 * Displays games in a grid layout with sorting, pagination, and price info.
 * Reuses the same .game-card styling from the landing page (welcome.css).
 */
export class BrowseComponent extends HTMLElement {
    /** All loaded games */
    private games: GameResult[] = [];

    /** Prices mapped by gameId (not every game has a price) */
    private prices: Partial<Record<string, ProductPrice>> = {};

    /** Current sort option */
    private currentSort: string = "Deal Rating";

    /** Current page number (0-indexed) */
    private currentPage: number = 0;

    /** Number of games per page */
    private readonly pageSize: number = 20;

    /** Game service instance */
    private readonly gameService: AllGameService = new AllGameService();

    /**
     * Attach the Shadow, load games and render
     */
    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        this.renderLoading();
        await this.loadGames();
        // this.isLoading = false;
        this.render();
    }

    /**
     * Load games from the API and fetch their prices
     */
    private async loadGames(): Promise<void> {
        try {
            const games: GameResult[] | null = await this.gameService.getAllGames();

            if (games.length === 0) {
                this.games = [];
                return;
            }

            this.games = games;

            // Fetch prices for all games
            const validGameIds: string[] = games
                .filter((g: GameResult) => g.gameId)
                .map((g: GameResult) => g.gameId);

            if (validGameIds.length > 0) {
                const pricesById: Record<string, ProductPrice> | null =
                    await this.gameService.getGamePrices(validGameIds);

                if (pricesById) {
                    this.prices = pricesById;
                }
            }
        }
        catch (error) {
            console.error("Fout bij het laden van games:", error);
            this.games = [];
        }
    }

    /**
     * Get sorted games based on the current sort option
     *
     * @returns Sorted array of games
     */
    private getSortedGames(): GameResult[] {
        const sorted: GameResult[] = [...this.games];

        switch (this.currentSort) {
            case "title-az":
                sorted.sort((a: GameResult, b: GameResult) =>
                    a.title.localeCompare(b.title));
                break;
            case "title-za":
                sorted.sort((a: GameResult, b: GameResult) =>
                    b.title.localeCompare(a.title));
                break;
            case "price-low":
                sorted.sort((a: GameResult, b: GameResult) => {
                    const priceA: number = this.prices[a.gameId]?.price ?? Infinity;
                    const priceB: number = this.prices[b.gameId]?.price ?? Infinity;
                    return priceA - priceB;
                });
                break;
            case "price-high":
                sorted.sort((a: GameResult, b: GameResult) => {
                    const priceA: number = this.prices[a.gameId]?.price ?? 0;
                    const priceB: number = this.prices[b.gameId]?.price ?? 0;
                    return priceB - priceA;
                });
                break;
            default:
                // Default "Deal Rating" order from the API
                break;
        }

        return sorted;
    }

    /**
     * Get paginated games for the current page
     *
     * @returns Array of games for the current page
     */
    private getPaginatedGames(): GameResult[] {
        const sorted: GameResult[] = this.getSortedGames();
        const start: number = this.currentPage * this.pageSize;
        const end: number = start + this.pageSize;
        return sorted.slice(start, end);
    }

    /**
     * Get the total number of pages
     *
     * @returns Total page count
     */
    private getTotalPages(): number {
        return Math.ceil(this.games.length / this.pageSize);
    }

    /**
     * Build the HTML for a single game card.
     * Uses the same .game-card structure as the landing page sale cards.
     *
     * @param game The game to render
     * @returns HTML string for the game card
     */
    private buildGameCard(game: GameResult): string {
        const price: ProductPrice | undefined = this.prices[game.gameId];

        let priceHtml: string = "";

        if (price && price.price > 0) {
            const savings: number = parseFloat(price.savings);

            if (savings > 0) {
                const salePrice: number = price.price - (price.price * savings / 100);
                priceHtml = `
                    <div class="price-wrapper">
                        <p class="discount">${Math.round(savings)}%</p>
                        <p class="original-price">€${price.price.toFixed(2)}</p>
                        <p class="discounted-price">€${salePrice.toFixed(2)}</p>
                    </div>
                `;
            }
            else {
                priceHtml = `
                    <div class="price-wrapper">
                        <p class="discounted-price">€${price.price.toFixed(2)}</p>
                    </div>
                `;
            }
        }
        else {
            priceHtml = `
                <div class="price-wrapper">
                    <p class="discounted-price">Prijs onbekend</p>
                </div>
            `;
        }

        return `
            <div class="game-card">
                <a href="/currentGame.html?gameId=${game.gameId}">
                    <img src="${game.thumbnail}" alt="${game.title}" loading="lazy" />
                    <p>${game.title}</p>
                    ${priceHtml}
                </a>
                <div class="bottom">
                    <img src="/assets/img/ui/Bottom.svg">
                </div>
            </div>
        `;
    }

    /**
     * Build the pagination controls HTML
     *
     * @returns HTML string for pagination
     */
    private buildPagination(): string {
        const totalPages: number = this.getTotalPages();

        if (totalPages <= 1) {
            return "";
        }

        let paginationHtml: string = "<div class=\"browse-pagination\">";

        // Previous button
        paginationHtml += `
            <button class="browse-page-btn" data-page="prev"
                ${this.currentPage === 0 ? "disabled" : ""}>
                ‹ Vorige
            </button>
        `;

        // Page numbers (show max 5 pages around current)
        const startPage: number = Math.max(0, this.currentPage - 2);
        const endPage: number = Math.min(totalPages - 1, this.currentPage + 2);

        if (startPage > 0) {
            paginationHtml += "<button class=\"browse-page-btn\" data-page=\"0\">1</button>";
            if (startPage > 1) {
                paginationHtml += "<span class=\"browse-page-dots\">...</span>";
            }
        }

        for (let i: number = startPage; i <= endPage; i++) {
            const activeClass: string = i === this.currentPage ? "active" : "";
            paginationHtml += `
                <button class="browse-page-btn ${activeClass}" data-page="${i}">
                    ${i + 1}
                </button>
            `;
        }

        if (endPage < totalPages - 1) {
            if (endPage < totalPages - 2) {
                paginationHtml += "<span class=\"browse-page-dots\">...</span>";
            }
            paginationHtml += `
                <button class="browse-page-btn" data-page="${totalPages - 1}">
                    ${totalPages}
                </button>
            `;
        }

        // Next button
        paginationHtml += `
            <button class="browse-page-btn" data-page="next"
                ${this.currentPage === totalPages - 1 ? "disabled" : ""}>
                Volgende ›
            </button>
        `;

        paginationHtml += "</div>";

        return paginationHtml;
    }

    /**
     * Render a loading skeleton while games are being fetched
     */
    private renderLoading(): void {
        if (!this.shadowRoot) {
            return;
        }

        const skeletonCards: string = Array.from({ length: 8 })
            .map(() => `
                <div class="game-card skeleton">
                    <div class="skeleton-img"></div>
                    <div class="skeleton-info">
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text short"></div>
                    </div>
                </div>
            `).join("");

        const element: HTMLElement = html`
            <div class="browse-container">
                <div class="browse-header">
                    <h1>Alle Games</h1>
                    <p>Ontdek ons volledige aanbod</p>
                </div>
                <div class="browse-grid">
                    ${skeletonCards}
                </div>
            </div>
        `;

        const welcomeStyle: HTMLLinkElement = document.createElement("link");
        welcomeStyle.setAttribute("rel", "stylesheet");
        welcomeStyle.setAttribute("href", "/assets/css/welcome.css");

        const browseStyle: HTMLLinkElement = document.createElement("link");
        browseStyle.setAttribute("rel", "stylesheet");
        browseStyle.setAttribute("href", "/assets/css/browsePage.css");

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(welcomeStyle);
        this.shadowRoot.appendChild(browseStyle);
    }

    /**
     * Render the full browse page with games, sorting, and pagination
     */
    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const paginatedGames: GameResult[] = this.getPaginatedGames();

        const gameCardsHtml: string = paginatedGames.length > 0
            ? paginatedGames.map((game: GameResult) => this.buildGameCard(game)).join("")
            : "<p class=\"browse-no-results\">Geen games gevonden.</p>";

        const totalResults: number = this.games.length;
        const showingFrom: number = this.currentPage * this.pageSize + 1;
        const showingTo: number = Math.min((this.currentPage + 1) * this.pageSize, totalResults);

        const element: HTMLElement = html`
            <div class="browse-container">
                <div class="browse-header">
                    <h1>Alle Games</h1>
                    <p>Ontdek ons volledige aanbod</p>
                </div>

                <div class="browse-toolbar">
                    <span class="browse-results-count">
                        ${totalResults > 0
                ? `${showingFrom}–${showingTo} van ${totalResults} games`
                : "Geen resultaten"}
            </span>

                    <div class="browse-sort">
                        <label for="sort-select">Sorteer op:</label>
                        <select id="sort-select">
                            <option value="Deal Rating" ${this.currentSort === "Deal Rating" ? "selected" : ""}>
                                Beste deal
                            </option>
                            <option value="title-az" ${this.currentSort === "title-az" ? "selected" : ""}>
                                Titel A–Z
                            </option>
                            <option value="title-za" ${this.currentSort === "title-za" ? "selected" : ""}>
                                Titel Z–A
                            </option>
                            <option value="price-low" ${this.currentSort === "price-low" ? "selected" : ""}>
                                Prijs laag–hoog
                            </option>
                            <option value="price-high" ${this.currentSort === "price-high" ? "selected" : ""}>
                                Prijs hoog–laag
                            </option>
                        </select>
                    </div>
                </div>

                <div class="browse-grid">
                    ${gameCardsHtml}
                </div>

                ${this.buildPagination()}
            </div>
        `;

        const welcomeStyle: HTMLLinkElement = document.createElement("link");
        welcomeStyle.setAttribute("rel", "stylesheet");
        welcomeStyle.setAttribute("href", "/assets/css/welcome.css");

        const browseStyle: HTMLLinkElement = document.createElement("link");
        browseStyle.setAttribute("rel", "stylesheet");
        browseStyle.setAttribute("href", "/assets/css/browsePage.css");

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(welcomeStyle);
        this.shadowRoot.appendChild(browseStyle);

        this.setupEventListeners();
    }

    /**
     * Attach event listeners to sorting dropdown, pagination buttons, etc.
     */
    private setupEventListeners(): void {
        if (!this.shadowRoot) {
            return;
        }

        // Sort select
        const sortSelect: HTMLSelectElement | null =
            this.shadowRoot.querySelector<HTMLSelectElement>("#sort-select");

        sortSelect?.addEventListener("change", () => {
            this.currentSort = sortSelect.value;
            this.currentPage = 0;
            this.render();
        });

        // Pagination buttons
        const pageButtons: NodeListOf<HTMLButtonElement> =
            this.shadowRoot.querySelectorAll<HTMLButtonElement>(".browse-page-btn");

        pageButtons.forEach((btn: HTMLButtonElement) => {
            btn.addEventListener("click", () => {
                const pageValue: string | undefined = btn.dataset.page;

                if (!pageValue) {
                    return;
                }

                if (pageValue === "prev") {
                    this.currentPage = Math.max(0, this.currentPage - 1);
                }
                else if (pageValue === "next") {
                    this.currentPage = Math.min(this.getTotalPages() - 1, this.currentPage + 1);
                }
                else {
                    this.currentPage = parseInt(pageValue);
                }

                this.render();

                // Scroll back to the top of the grid
                this.shadowRoot?.querySelector(".browse-container")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            });
        });
    }
}

window.customElements.define("webshop-browse", BrowseComponent);
