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
            <nav>
                <a href="/index.html">Home</a>
                <a href="/example.html">Example</a>
                <a href="/register.html">Registreren</a>
                ${sessionId
                    ? html`<a href="/logout.html" id="logout">Uitloggen</a>`
                    : html`<a href="/login.html" id="login">Inloggen</a>`}
            </nav>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
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
