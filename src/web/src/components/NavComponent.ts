import { html } from "@web/helpers/webComponents";
import { LogoutService } from "../services/LogoutService";

export class NavComponent extends HTMLElement {
    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });

        await this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) return;

        let sessionId: string | null = null;

        try {
            const timeoutMs: number = 2500;
            const sessionInfo: { sessionId: string; userId: number } = await this.withTimeout(this.getSecret(), timeoutMs);
            sessionId = sessionInfo.sessionId;
        }
        catch (error) {
            console.warn("User is not logged in or failed to fetch session:", error);
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

      <!-- Hamburger Menu Toggle -->
      <input type="checkbox" id="hamburger-toggle" class="hamburger-toggle" />
      <label for="hamburger-toggle" class="hamburger-icon">
  <img src="/assets/img/icons/HamburgerIcon.svg" alt="Menu" width="24" height="24" />
</label>

      <!-- Center Search Bar (Hidden on mobile) -->
      <div class="navbar-center">
        <div class="searchbar">
          <button>
            <img src="/assets/img/icons/SearchIcon.png" alt="Search" />
          </button>
          <input type="text" placeholder="Zoek game..." />
        </div>
      </div>

      <!-- Search Overlay -->
<div class="mobile-search-overlay">
  <div class="mobile-searchbar-container">
    <button class="mobile-search-btn">
      <img src="/assets/img/icons/SearchIcon.png" alt="Search" />
    </button>
    <input type="text" placeholder="Zoek game..." />
    <label for="mobile-search-toggle" class="close-search">
      <img src="/assets/img/icons/CloseIcon.svg" alt="Close" />
    </label>
  </div>
</div>

      <!-- Right Buttons (Hidden on mobile) -->
      <div class="navbar-right">
        ${
          sessionId
            ? html`
                <span>
                  <a id="user" href="/profile.html"><img src="/assets/images/userButton.png" width="50" /></a>
                  <a id="logout">Uitloggen</a>
                </span>
              `
            : html`
                <span>
                  <a href="/login.html" id="login">Inloggen</a>
                  <a href="/register.html">Registreren</a>
                </span>
              `
        }
      </div>

      <!-- Mobile Menu (Dropdown under hamburger) -->
      <div class="mobile-menu">
        ${
          sessionId
            ? html`
                <a href="/profile.html">Profiel</a>
                <a id="logout">Uitloggen</a>
              `
            : html`
<div class="mobile-auth">
  <a href="/login.html">Inloggen</a>
  <a href="/register.html">Registreren</a>
</div>
              `
        }
      </div>
    </div>
  </div>
`;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/navbar.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);

        // Add logout logic only if button exists
        const logoutBtn: Element | null = this.shadowRoot.querySelector("#logout");
        if (logoutBtn && sessionId) {
            const logoutService: LogoutService = new LogoutService();
            logoutBtn.addEventListener("click", async e => {
                e.preventDefault();
                await logoutService.logoutUser(sessionId);
                window.location.href = "index.html"; // Optional redirect
            });
        }
    }

    private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
        return Promise.race([
            promise,
            new Promise<T>((_, reject) => {
                const timerId: number = window.setTimeout(() => {
                    reject(new Error("Request timed out"));
                }, timeoutMs);

                // Cleanup is handled by Promise.race result resolution
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
            console.error("Error in getSecret:", error);
            throw error;
        }
    }
}

window.customElements.define("webshop-navigation", NavComponent);
