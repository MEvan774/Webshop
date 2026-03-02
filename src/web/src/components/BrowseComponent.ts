import { GameResult, ProductPrice } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { AllGameService } from "@web/services/AllGamesService";
import { WebshopEvent } from "@web/enums/WebshopEvent";
import { WebshopEventService } from "@web/services/WebshopEventService";
import { FilterData } from "@web/types/FilterData";

/**
 * Component for browsing all available game deals.
 * Displays games in a grid layout with sorting, pagination, and price info.
 * Reuses the same .game-card styling from the landing page (welcome.css).
 * Listens for FilterChange events from the sidebar to filter the grid.
 *
 * Games and prices are fetched in a single API call to avoid jittering
 * and reduce the number of requests to the Steam API.
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

    /** Event service for listening to sidebar filter changes */
    private readonly eventService: WebshopEventService = new WebshopEventService();

    /** Current active filters from sidebar */
    private activeFilters: FilterData = {
        minPrice: null, maxPrice: null, labels: [],
        sortBy: null,
    };

    /**
     * Attach the Shadow, load games, listen for filter events and render
     */
    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        this.renderLoading();

        // Listen for filter changes from the sidebar
        this.eventService.addEventListener<FilterData>(WebshopEvent.FilterChange, (filterData: FilterData) => {
            this.activeFilters = filterData;

            if (filterData.sortBy) {
                this.currentSort = filterData.sortBy;
            }

            this.currentPage = 0;
            this.render();
        });

        await this.loadGames();
        this.render();
    }

    /**
     * Load games AND prices from the API in a single request.
     * The backend bundles both in one response from the Steam
     * featuredcategories endpoint, so no separate price fetching is needed.
     */
    private async loadGames(): Promise<void> {
        try {
            const result: { games: GameResult[]; prices: Record<string, ProductPrice> } | null = await this.gameService.getAllGamesWithPrices();

            if (!result || result.games.length === 0) {
                this.games = [];
                this.prices = {};
                return;
            }

            this.games = result.games;
            this.prices = result.prices;
        }
        catch (error) {
            console.error("Fout bij het laden van games:", error);
            this.games = [];
            this.prices = {};
        }
    }

    /**
     * Get filtered games based on the current active sidebar filters.
     *
     * @returns Filtered array of games
     */
    private getFilteredGames(): GameResult[] {
        return this.games.filter((game: GameResult) => {
            const price: ProductPrice | undefined = this.prices[game.gameId];

            // Price range filter
            if (this.activeFilters.minPrice !== null && price) {
                if (price.price < this.activeFilters.minPrice) {
                    return false;
                }
            }

            if (this.activeFilters.maxPrice !== null && price) {
                if (price.price > this.activeFilters.maxPrice) {
                    return false;
                }
            }

            // Label / tag filter
            if (this.activeFilters.labels.length > 0 && game.tags) {
                const hasMatchingTag: boolean = this.activeFilters.labels.some(
                    (label: string) => game.tags!.includes(label)
                );

                if (!hasMatchingTag) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Get sorted games (after filtering)
     *
     * @returns Sorted array of games
     */
    private getSortedGames(): GameResult[] {
        const filtered: GameResult[] = this.getFilteredGames();
        const sorted: GameResult[] = [...filtered];

        switch (this.currentSort) {
            case "title-az":
                sorted.sort((a: GameResult, b: GameResult) => a.title.localeCompare(b.title));
                break;
            case "title-za":
                sorted.sort((a: GameResult, b: GameResult) => b.title.localeCompare(a.title));
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
     * Get the total number of pages (based on filtered results)
     *
     * @returns Total page count
     */
    private getTotalPages(): number {
        return Math.ceil(this.getFilteredGames().length / this.pageSize);
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
        else if (price && price.price === 0) {
            priceHtml = `
                <div class="price-wrapper">
                    <p class="discounted-price free">Gratis</p>
                </div>
            `;
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

        paginationHtml += `
            <button class="browse-page-btn" data-page="prev"
                ${this.currentPage === 0 ? "disabled" : ""}>
                ‹ Vorige
            </button>
        `;

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
     * Build a summary of the active filters for the user
     *
     * @returns HTML string showing which filters are active, or empty string
     */
    private buildActiveFiltersDisplay(): string {
        const parts: string[] = [];

        if (this.activeFilters.minPrice !== null) {
            parts.push(`Min: €${this.activeFilters.minPrice.toFixed(2)}`);
        }

        if (this.activeFilters.maxPrice !== null) {
            parts.push(`Max: €${this.activeFilters.maxPrice.toFixed(2)}`);
        }

        if (this.activeFilters.labels.length > 0) {
            parts.push(this.activeFilters.labels.join(", "));
        }

        if (parts.length === 0) {
            return "";
        }

        return `
            <div class="browse-active-filters">
                <span class="browse-filter-label">Actieve filters:</span>
                <span class="browse-filter-tags">${parts.join(" · ")}</span>
            </div>
        `;
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
        const filteredTotal: number = this.getFilteredGames().length;

        const gameCardsHtml: string = paginatedGames.length > 0
            ? paginatedGames.map((game: GameResult) => this.buildGameCard(game)).join("")
            : "<p class=\"browse-no-results\">Geen games gevonden met deze filters.</p>";

        const showingFrom: number = filteredTotal > 0 ? this.currentPage * this.pageSize + 1 : 0;
        const showingTo: number = Math.min((this.currentPage + 1) * this.pageSize, filteredTotal);

        const element: HTMLElement = html`
            <div class="browse-container">
                <div class="browse-header">
                    <h1>Alle Games</h1>
                    <p>Ontdek ons volledige aanbod</p>
                </div>

                <div class="browse-toolbar">
                    <span class="browse-results-count">
                        ${filteredTotal > 0
                ? `${showingFrom}–${showingTo} van ${filteredTotal} games`
                : "Geen resultaten"}
                    </span>
                </div>

                ${this.buildActiveFiltersDisplay()}

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
     * Attach event listeners to pagination buttons
     */
    private setupEventListeners(): void {
        if (!this.shadowRoot) {
            return;
        }

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

                this.shadowRoot?.querySelector(".browse-container")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            });
        });
    }
}

window.customElements.define("webshop-browse", BrowseComponent);
