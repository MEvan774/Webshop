import { html } from "@web/helpers/webComponents";
import { LogoutService } from "../services/LogoutService";
import { AllGameService } from "@web/services/AllGamesService";
import { CheapSharkGameSearch } from "@shared/types";

export class NavComponent extends HTMLElement {
    private searchTimeout: number | null = null;
    private allGameService: AllGameService = new AllGameService();

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });

        // Render immediately with empty auth section
        this.renderNavbar();

        // Wire up search right away
        this.setupSearch();

        // Check session in the background, then render the correct buttons
        await this.checkSessionAndUpdate();
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

      <!-- Hamburger Menu Toggle -->
      <input type="checkbox" id="hamburger-toggle" class="hamburger-toggle" />
      <label for="hamburger-toggle" class="hamburger-icon">
  <img src="/assets/img/icons/HamburgerIcon.svg" alt="Menu" width="24" height="24" />
</label>

<!-- Center Search Bar (Hidden on mobile) -->
<div class="navbar-center">
<!-- Browse link -->
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

      <!-- Right Buttons (empty until session check completes) -->
      <div class="navbar-right" id="auth-section"></div>

      <!-- Mobile Menu (Dropdown under hamburger) -->
      <div class="mobile-menu">
      <a href="/browse.html" class="mobile-menu-link">Alle Games</a>
        <div id="mobile-auth-section" class="mobile-auth"></div>
      </div>
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
                background-color: #e0d6c6;
            }

            .search-result-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
                overflow: hidden;
            }

            .search-result-title {
                font-family: 'TimesNewRoman', serif;
                font-size: 0.95rem;
                font-weight: bold;
                color: #1C2594;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .search-result-price {
                font-family: 'TimesNewRoman', serif;
                font-size: 0.8rem;
                color: #555;
            }

            .search-no-results,
            .search-loading {
                padding: 16px;
                text-align: center;
                color: #888;
                font-family: 'TimesNewRoman', serif;
                font-size: 0.95rem;
            }

            @media (max-width: 768px) {
                .search-dropdown {
                    max-width: 100%;
                    left: 0;
                    transform: none;
                    border-radius: 0 0 8px 8px;
                }
            }
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);
        this.shadowRoot.appendChild(searchStyles);
    }

    private setupSearch(): void {
        if (!this.shadowRoot) return;

        const dropdownContainer: HTMLElement | null = this.shadowRoot.getElementById("search-dropdown-container");
        if (!dropdownContainer) return;

        const dropdown: HTMLDivElement = document.createElement("div");
        dropdown.className = "search-dropdown";
        dropdown.id = "search-dropdown";
        dropdownContainer.appendChild(dropdown);

        const desktopInput: HTMLInputElement | null = this.shadowRoot.getElementById("desktop-search-input") as HTMLInputElement | null;
        const desktopButton: HTMLElement | null = this.shadowRoot.getElementById("desktop-search-btn");
        const mobileInput: HTMLInputElement | null = this.shadowRoot.getElementById("mobile-search-input") as HTMLInputElement | null;
        const mobileButton: HTMLElement | null = this.shadowRoot.getElementById("mobile-search-btn");

        if (desktopInput) {
            desktopInput.addEventListener("input", (e: Event) => {
                e.stopPropagation();
                this.debounceSearch(desktopInput.value, dropdown);
            });

            desktopInput.addEventListener("keydown", (e: KeyboardEvent) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.searchTimeout) window.clearTimeout(this.searchTimeout);
                    void this.handleSearch(desktopInput.value, dropdown);
                }
            });

            desktopInput.addEventListener("click", (e: Event) => {
                e.stopPropagation();
            });
        }

        if (desktopButton && desktopInput) {
            desktopButton.addEventListener("click", (e: Event) => {
                e.stopPropagation();
                if (this.searchTimeout) window.clearTimeout(this.searchTimeout);
                void this.handleSearch(desktopInput.value, dropdown);
            });
        }

        if (mobileInput) {
            mobileInput.addEventListener("input", (e: Event) => {
                e.stopPropagation();
                this.debounceSearch(mobileInput.value, dropdown);
            });

            mobileInput.addEventListener("keydown", (e: KeyboardEvent) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.searchTimeout) window.clearTimeout(this.searchTimeout);
                    void this.handleSearch(mobileInput.value, dropdown);
                }
            });

            mobileInput.addEventListener("click", (e: Event) => {
                e.stopPropagation();
            });
        }

        if (mobileButton && mobileInput) {
            mobileButton.addEventListener("click", (e: Event) => {
                e.stopPropagation();
                if (this.searchTimeout) window.clearTimeout(this.searchTimeout);
                void this.handleSearch(mobileInput.value, dropdown);
            });
        }

        dropdown.addEventListener("click", (e: Event) => {
            e.stopPropagation();
        });

        document.addEventListener("click", () => {
            dropdown.classList.remove("active");
        });

        this.shadowRoot.addEventListener("click", (e: Event) => {
            const target: HTMLElement | null = e.target as HTMLElement | null;
            if (!target) return;

            const isSearchInput: boolean = target.id === "desktop-search-input" || target.id === "mobile-search-input";
            const isDropdown: boolean = target.closest("#search-dropdown-container") !== null;

            if (!isSearchInput && !isDropdown) {
                dropdown.classList.remove("active");
            }
        });
    }

    private debounceSearch(query: string, dropdown: HTMLDivElement): void {
        if (this.searchTimeout) {
            window.clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = window.setTimeout(() => {
            void this.handleSearch(query, dropdown);
        }, 300);
    }

    private async handleSearch(query: string, dropdown: HTMLDivElement): Promise<void> {
        const trimmedQuery: string = query.trim();

        if (trimmedQuery.length < 2) {
            dropdown.classList.remove("active");
            dropdown.innerHTML = "";
            return;
        }

        dropdown.innerHTML = "<div class=\"search-loading\">Zoeken...</div>";
        dropdown.classList.add("active");

        try {
            const results: CheapSharkGameSearch[] =
                await this.allGameService.searchGames(trimmedQuery) as unknown as CheapSharkGameSearch[];

            dropdown.innerHTML = "";

            if (results.length === 0) {
                dropdown.innerHTML = "<div class=\"search-no-results\">Geen resultaten gevonden</div>";
                dropdown.classList.add("active");
                return;
            }

            const maxResults: number = Math.min(results.length, 8);

            for (let i: number = 0; i < maxResults; i++) {
                const game: CheapSharkGameSearch = results[i];

                const item: HTMLAnchorElement = document.createElement("a");
                item.className = "search-result-item";
                item.href = `/currentGame.html?gameId=${game.gameID}`;

                const img: HTMLImageElement = document.createElement("img");
                img.src = game.thumb || "/assets/img/icons/LogoIcon.png";
                img.alt = game.external || "Game";
                img.onerror = (): void => {
                    img.src = "/assets/img/icons/LogoIcon.png";
                };

                const info: HTMLDivElement = document.createElement("div");
                info.className = "search-result-info";

                const titleSpan: HTMLSpanElement = document.createElement("span");
                titleSpan.className = "search-result-title";
                titleSpan.textContent = game.external || "Onbekende game";

                const priceSpan: HTMLSpanElement = document.createElement("span");
                priceSpan.className = "search-result-price";
                priceSpan.textContent = game.cheapest ? `Vanaf $${game.cheapest}` : "";

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
