import "@web/components/NavComponent";
import "@web/components/CurrentGameComponent";
import { html } from "@web/helpers/webComponents";
/**
 * Class for the current game page, extends HTMLElement
 */
export class CurrentGamePageComponent extends HTMLElement {
    /**
     * Attach the Shadow and render the HTML
     */
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
    }

    /**
     * Render the HTML content from the nav bar and CurrentGameComponent
     *
     * @returns Void
     */
    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <div>
                <nav-bar></nav-bar>

                <div>
                    <webshop-currentgame></webshop-currentgame>
                </div>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-currentgame", CurrentGamePageComponent);
