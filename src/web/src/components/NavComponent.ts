export class NavComponent extends HTMLElement {
    public conncetedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    public render(): void {
        try {
            if (!this.shadowRoot) {
                throw new Error("No ShadowRoot");
            }

            const element: HTMLElement = html`
            <nav>

            </nav>
            `;
        }
        catch (error) {
            console.error(error);
        }
    }
}

window.customElements.define("nav-bar", NavComponent);
