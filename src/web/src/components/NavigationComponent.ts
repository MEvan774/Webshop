import { html } from "@web/helpers/webComponents";

export class NavigationComponent extends HTMLElement {
    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });

        await this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const sessionInfo: { sessionId: string; userId: number } = await this.getSecret();
        const sessionId: string = sessionInfo.sessionId;

        console.log("Sessiecookie:", sessionId);

        const element: HTMLElement = html`
        <div>
        <div class="navbar">
            <div class="navbar-left">
                <!-- logo or brand -->
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
                <a href="/register.html">Registreren</a>
                ${sessionId
                    ? html`<a href="/logout.html" id="logout">Uitloggen</a>`
                    : html`<a href="/login.html" id="login">Inloggen</a>`}
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
    }

    private async getSecret(): Promise<{ sessionId: string; userId: number }> {
        try {
            const response: Response = await fetch(`${VITE_API_URL}secret`, {
                credentials: "include", // Zorg ervoor dat de cookies worden meegestuurd
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

window.customElements.define("webshop-navigation", NavigationComponent);
