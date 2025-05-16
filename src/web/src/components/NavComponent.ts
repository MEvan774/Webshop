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
            const sessionInfo: { sessionId: string; userId: number } = await this.getSecret();
            sessionId = sessionInfo.sessionId;
        }
        catch (error) {
            console.warn("User is not logged in or failed to fetch session:", error);
        }

        const element: HTMLElement = html`
            <div>
            <div class="navbar">
                <div class="navbar-left">
                    <a href="index.html" class="brand-link">
                        <img class="logo" src="/assets/img/icons/LogoIcon.png" />
                        <div class="brand">
                            <p class="brand-name">LucaStarShop</p>
                            <p class="brand-tagline">De shop voor de sterren in gaming!</p>
                        </div>
                    </a>
                </div>

                <div class="navbar-center">
                    <div class="searchbar">
                        <button>
                            <img src="/assets/img/icons/SearchIcon.png" alt="Search" />
                        </button>
                        <input type="text" placeholder="Zoek game..." />
                    </div>
                </div>

                <div class="navbar-right">
    ${
        sessionId
            ? html`
                <span>
                    <a id="user" href="/profile.html"><img src="/assets/images/userButton.png" width=50px></a>
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
