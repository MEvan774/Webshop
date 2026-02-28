import { html } from "@web/helpers/webComponents";
import { LogoutService } from "../services/LogoutService";
import { AllGameService } from "@web/services/AllGamesService";
import { ShoppingCartService } from "@web/services/ShoppingCartService";
import { GameResult } from "@shared/types";

export class NavComponent extends HTMLElement {
    private searchTimeout: number | null = null;
    private allGameService: AllGameService = new AllGameService();

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });

        // Render immediately with empty auth section
        this.renderNavbar();

        // Wire up search right away
        this.setupSearch();

        // Show initial cart count
        this.updateCartCount();

        // Listen for cart changes from other components
        window.addEventListener("cart-updated", (): void => {
            this.updateCartCount();
        });

        // Check session in the background, then render the correct buttons
        await this.checkSessionAndUpdate();
    }

    /**
     * Updates the cart counter badge in both desktop and mobile nav.
     * Reads the count from localStorage via ShoppingCartService.
     */
    private updateCartCount(): void {
        if (!this.shadowRoot) return;

        const cartService: ShoppingCartService = new ShoppingCartService();
        const count: number = cartService.getCartCount();

        // Desktop badge
        const desktopBadge: HTMLSpanElement | null = this.shadowRoot.querySelector("#cart-count-desktop");
        if (desktopBadge) {
            desktopBadge.textContent = count.toString();
            desktopBadge.style.display = count > 0 ? "inline-flex" : "none";
        }

        // Mobile badge
        const mobileBadge: HTMLSpanElement | null = this.shadowRoot.querySelector("#cart-count-mobile");
        if (mobileBadge) {
            mobileBadge.textContent = count.toString();
            mobileBadge.style.display = count > 0 ? "inline-flex" : "none";
        }
    }

    /**
     * Check session in the background.
     * On success: show logged-in buttons.
     * On failure: show logged-out buttons (Inloggen / Registreren).
     */
    private async checkSessionAndUpdate(): Promise<void> {
        try {
            const timeoutMs: number = 2500;
            const sessionInfo: { sessionId: string; userId: number } = await this.withTimeout(this.getSecret(), timeoutMs);
            this.renderLoggedIn(sessionInfo.sessionId);
        }
        catch (error) {
            console.log("User is not logged in or failed to fetch session:", error);
            this.renderLoggedOut();
        }
    }

    /**
     * Renders the logged-out buttons into the auth sections.
     */
    private renderLoggedOut(): void {
        if (!this.shadowRoot) return;

        // Desktop
        const authContainer: HTMLElement | null = this.shadowRoot.getElementById("auth-section");
        if (authContainer) {
            authContainer.innerHTML = "";

            const loginLink: HTMLAnchorElement = document.createElement("a");
            loginLink.href = "/login.html";
            loginLink.id = "login";
            loginLink.textContent = "Inloggen";

            const registerLink: HTMLAnchorElement = document.createElement("a");
            registerLink.href = "/register.html";
            registerLink.textContent = "Registreren";

            authContainer.appendChild(loginLink);
            authContainer.appendChild(registerLink);
        }

        // Mobile
        const mobileAuthContainer: HTMLElement | null = this.shadowRoot.getElementById("mobile-auth-section");
        if (mobileAuthContainer) {
            mobileAuthContainer.innerHTML = "";

            const mobileLoginLink: HTMLAnchorElement = document.createElement("a");
            mobileLoginLink.href = "/login.html";
            mobileLoginLink.textContent = "Inloggen";

            const mobileRegisterLink: HTMLAnchorElement = document.createElement("a");
            mobileRegisterLink.href = "/register.html";
            mobileRegisterLink.textContent = "Registreren";

            mobileAuthContainer.appendChild(mobileLoginLink);
            mobileAuthContainer.appendChild(mobileRegisterLink);
        }
    }

    /**
     * Renders the logged-in buttons into the auth sections.
     */
    private renderLoggedIn(sessionId: string): void {
        if (!this.shadowRoot) return;

        const logoutService: LogoutService = new LogoutService();

        // Desktop
        const authContainer: HTMLElement | null = this.shadowRoot.getElementById("auth-section");
        if (authContainer) {
            authContainer.innerHTML = "";

            const userLink: HTMLAnchorElement = document.createElement("a");
            userLink.id = "user";
            userLink.href = "/profile.html";

            const userImg: HTMLImageElement = document.createElement("img");
            userImg.src = "/assets/images/userButton.png";
            userImg.width = 50;
            userLink.appendChild(userImg);

            const logoutLink: HTMLAnchorElement = document.createElement("a");
            logoutLink.id = "logout";
            logoutLink.textContent = "Uitloggen";
            logoutLink.href = "#";
            logoutLink.addEventListener("click", async (e: Event) => {
                e.preventDefault();
                await logoutService.logoutUser(sessionId);
                window.location.href = "index.html";
            });

            authContainer.appendChild(userLink);
            authContainer.appendChild(logoutLink);
        }

        // Mobile
        const mobileAuthContainer: HTMLElement | null = this.shadowRoot.getElementById("mobile-auth-section");
        if (mobileAuthContainer) {
            mobileAuthContainer.innerHTML = "";

            const mobileProfileLink: HTMLAnchorElement = document.createElement("a");
            mobileProfileLink.href = "/profile.html";
            mobileProfileLink.textContent = "Profiel";

            const mobileLogoutLink: HTMLAnchorElement = document.createElement("a");
            mobileLogoutLink.id = "mobile-logout";
            mobileLogoutLink.textContent = "Uitloggen";
            mobileLogoutLink.href = "#";
            mobileLogoutLink.addEventListener("click", async (e: Event) => {
                e.preventDefault();
                await logoutService.logoutUser(sessionId);
                window.location.href = "index.html";
            });

            mobileAuthContainer.appendChild(mobileProfileLink);
            mobileAuthContainer.appendChild(mobileLogoutLink);
        }
    }

    /**
     * Renders the navbar with an empty auth section (buttons filled in later).
     */
    private renderNavbar(): void {
        if (!this.shadowRoot) return;

        // Ensure fonts are available at the document level (needed for Shadow DOM)
        if (!document.querySelector("#nav-global-fonts")) {
            const globalStyle: HTMLStyleElement = document.createElement("style");
            globalStyle.id = "nav-global-fonts";
            globalStyle.textContent = `
        @font-face {
            font-family: 'Pacifico';
            src: url('/assets/fonts/Pacifico.ttf');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'Times New Roman';
            src: url('/assets/fonts/TimesNewRoman.ttf');
            font-weight: normal;
            font-style: normal;
        }
    `;
            document.head.appendChild(globalStyle);
        }

const element: HTMLElement = html`
  <div>
    <div class="navbar">
      <!-- Left (Logo + Brand) -->
      <div class="navbar-left">
        <a href="index.html" class="brand-link">
          <img class="logo" src="/assets/img/icons/LogoIcon.png" />
          <div class="brand">
            <p class="brand-name">LucaStarShop</p>
            <p class="brand-tagline">De shop voor de sterren in gaming!</p>
          </div>
        </a>
      </div>

      <!-- Mobile Search Toggle -->
      <input type="checkbox" id="mobile-search-toggle" class="mobile-search-toggle" />
      <label for="mobile-search-toggle" class="mobile-search-icon">
        <img src="/assets/img/icons/SearchWhiteIcon.svg" alt="Search" width="34" height="34" />
      </label>

      <!-- Hamburger label stays inside navbar for layout -->
      <label for="hamburger-toggle" class="hamburger-icon">
        <img src="/assets/img/icons/HamburgerIcon.svg" alt="Menu" width="24" height="24" />
      </label>

      <!-- Center Search Bar (Hidden on mobile) -->
      <div class="navbar-center">
        <a href="/browse.html" class="navbar-browse-link">Browse</a>
        <div class="searchbar">
          <button id="desktop-search-btn">
            <img src="/assets/img/icons/SearchIcon.png" alt="Search" />
          </button>
          <input type="text" placeholder="Zoek game..." id="desktop-search-input" />
        </div>
      </div>

      <!-- Search Overlay -->
      <div class="mobile-search-overlay">
        <div class="mobile-searchbar-container">
          <button id="mobile-search-btn">
            <img src="/assets/img/icons/SearchIcon.png" alt="Search" />
          </button>
          <input type="text" placeholder="Zoek game..." id="mobile-search-input" />
          <label for="mobile-search-toggle" class="close-search">
            <img src="/assets/img/icons/CloseIcon.svg" alt="Close" />
          </label>
        </div>
      </div>

      <!-- Cart button (desktop) -->
      <a href="/payment.html" class="navbar-cart" id="cart-link-desktop">
        <span class="cart-icon"><img src="/assets/img/icons/ShoppingCart.svg" width="40" height="40" alt="Cart" /></span>
        <span class="cart-badge" id="cart-count-desktop" style="display: none;">0</span>
      </a>

      <!-- Right Buttons -->
      <div class="navbar-right" id="auth-section"></div>
    </div>

    <!-- Checkbox + Mobile Menu OUTSIDE navbar, but inside root div -->
    <input type="checkbox" id="hamburger-toggle" class="hamburger-toggle" />
    <div class="mobile-menu">
      <a href="/browse.html" class="mobile-menu-link">Browse</a>
      <a href="/payment.html" class="mobile-menu-link">
        Winkelwagen
        <span class="cart-badge-mobile" id="cart-count-mobile" style="display: none;">0</span>
      </a>
      <div id="mobile-auth-section" class="mobile-auth"></div>
    </div>

    <!-- Search dropdown below navbar -->
    <div id="search-dropdown-container"></div>
  </div>
`;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/navbar.css");

        const searchStyles: HTMLStyleElement = document.createElement("style");
        searchStyles.textContent = `
            #search-dropdown-container {
                position: relative;
                width: 100%;
                z-index: 9999;
            }

            .search-dropdown {
                display: none;
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 100%;
                max-width: 500px;
                background: #FFFAF0;
                border-radius: 0 0 12px 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                max-height: 400px;
                overflow-y: auto;
                z-index: 9999;
            }

            .search-dropdown.active {
                display: block;
            }

            .search-result-item {
                display: flex;
                align-items: center;
                padding: 10px 16px;
                cursor: pointer;
                text-decoration: none;
                color: #000;
                border-bottom: 1px solid #ece3d4;
                transition: background-color 0.15s ease;
            }

            .search-result-item:last-child {
                border-bottom: none;
            }

            .search-result-item:hover {
                background-color: #f0e6d6;
            }

            .search-result-item img {
                width: 48px;
                height: 48px;
                object-fit: cover;
                border-radius: 6px;
                margin-right: 12px;
                flex-shrink: 0;
            }

            .search-result-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .search-result-title {
                font-family: 'TimesNewRoman';
                font-size: 0.95rem;
                font-weight: 600;
                color: #1C2594;
            }

            .search-result-price {
                font-family: 'TimesNewRoman';
                font-size: 0.85rem;
                color: #666;
            }

            .search-no-results {
                padding: 16px;
                text-align: center;
                color: #888;
                font-family: 'TimesNewRoman';
            }

            /* ======== Cart icon + badge (desktop) ======== */
            .navbar-cart {
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-right: 8px;
                padding: 0 !important;
                width: auto !important;
                height: auto !important;
                background: transparent !important;
                text-decoration: none;
                cursor: pointer;
                line-height: 1;
            }

            .cart-icon {
                font-size: 1.6rem;
                float: right;
                color: #FFFAF0;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25));
                transition: transform 0.2s ease;
            }

            .navbar-cart:hover .cart-icon {
                transform: scale(1.15);
            }

            @media (max-width: 768px) {
    .navbar-cart {
        display: none;
    }
}

            .cart-badge {
                position: absolute;
                top: -6px;
                right: -10px;
                background-color: #FF9900;
                color: #fff;
                font-size: 0.7rem;
                font-weight: 700;
                font-family: 'TimesNewRoman', serif;
                min-width: 18px;
                height: 18px;
                border-radius: 9px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0 5px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                line-height: 1;
            }

            /* ======== Cart badge (mobile menu) ======== */
            .cart-badge-mobile {
                background-color: #FF9900;
                color: #fff;
                font-size: 0.7rem;
                font-weight: 700;
                font-family: 'TimesNewRoman', serif;
                min-width: 18px;
                height: 18px;
                border-radius: 9px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0 5px;
                margin-left: 8px;
                vertical-align: middle;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                line-height: 1;
            }
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(styleLink);
        this.shadowRoot.appendChild(searchStyles);
        this.shadowRoot.append(element);
    }

    /**
     * Set up desktop and mobile search input listeners.
     */
    private setupSearch(): void {
        if (!this.shadowRoot) return;

        const desktopInput: HTMLInputElement | null = this.shadowRoot.querySelector("#desktop-search-input");
        const mobileInput: HTMLInputElement | null = this.shadowRoot.querySelector("#mobile-search-input");

        if (desktopInput) {
            desktopInput.addEventListener("input", (): void => {
                this.handleSearchInput(desktopInput.value);
            });

            desktopInput.addEventListener("blur", (): void => {
                setTimeout((): void => this.hideSearchDropdown(), 200);
            });
        }

        if (mobileInput) {
            mobileInput.addEventListener("input", (): void => {
                this.handleSearchInput(mobileInput.value);
            });

            mobileInput.addEventListener("blur", (): void => {
                setTimeout((): void => this.hideSearchDropdown(), 200);
            });
        }
    }

    private hideSearchDropdown(): void {
        if (!this.shadowRoot) return;
        const dropdown: HTMLElement | null = this.shadowRoot.querySelector(".search-dropdown");
        if (dropdown) {
            dropdown.classList.remove("active");
        }
    }

    private handleSearchInput(query: string): void {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        if (query.trim().length < 2) {
            this.hideSearchDropdown();
            return;
        }

        this.searchTimeout = window.setTimeout((): void => {
            void this.performSearch(query.trim());
        }, 300);
    }

    private async performSearch(query: string): Promise<void> {
        if (!this.shadowRoot) return;

        let dropdown: HTMLElement | null = this.shadowRoot.querySelector(".search-dropdown");
        const container: HTMLElement | null = this.shadowRoot.querySelector("#search-dropdown-container");

        if (!container) return;

        if (!dropdown) {
            dropdown = document.createElement("div");
            dropdown.classList.add("search-dropdown");
            container.appendChild(dropdown);
        }

        dropdown.innerHTML = "<div class=\"search-no-results\">Zoeken...</div>";
        dropdown.classList.add("active");

        try {
            const games: GameResult[] = await this.allGameService.searchGames(query);

            dropdown.innerHTML = "";

            if (games.length === 0) {
                dropdown.innerHTML = "<div class=\"search-no-results\">Geen resultaten gevonden</div>";
                return;
            }

            for (const game of games.slice(0, 8)) {
                const item: HTMLAnchorElement = document.createElement("a");
                item.classList.add("search-result-item");
                item.href = `/currentGame.html?gameId=${game.gameId}`;

                const img: HTMLImageElement = document.createElement("img");
                img.src = game.thumbnail;
                img.alt = game.title;

                const info: HTMLDivElement = document.createElement("div");
                info.classList.add("search-result-info");

                const titleSpan: HTMLSpanElement = document.createElement("span");
                titleSpan.classList.add("search-result-title");
                titleSpan.textContent = game.title;

                const priceSpan: HTMLSpanElement = document.createElement("span");
                priceSpan.classList.add("search-result-price");
                priceSpan.textContent = "";

                info.appendChild(titleSpan);
                info.appendChild(priceSpan);

                item.appendChild(img);
                item.appendChild(info);
                dropdown.appendChild(item);
            }

            dropdown.classList.add("active");
        }
        catch (error) {
            console.error("Fout bij zoeken:", error);
            dropdown.innerHTML = "<div class=\"search-no-results\">Er ging iets mis bij het zoeken</div>";
            dropdown.classList.add("active");
        }
    }

    private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
        return Promise.race([
            promise,
            new Promise<T>((_, reject) => {
                const timerId: number = window.setTimeout(() => {
                    reject(new Error("Request timed out"));
                }, timeoutMs);

                void promise.finally(() => clearTimeout(timerId));
            }),
        ]);
    }

    private async getSecret(): Promise<{ sessionId: string; userId: number }> {
        try {
            const response: Response = await fetch(`${VITE_API_URL}secret`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Fout bij ophalen van geheime gegevens");
            }

            const data: { sessionId: string; userId: number } = await response.json() as { sessionId: string; userId: number };
            return { sessionId: data.sessionId, userId: data.userId };
        }
        catch (error) {
            console.log("Error in getSecret:", error);
            throw error;
        }
    }
}

window.customElements.define("webshop-navigation", NavComponent);
