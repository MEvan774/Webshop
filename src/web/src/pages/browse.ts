import "@web/components/NavComponent";
import "@web/components/SidebarComponent";
import "@web/components/BrowseComponent";
import { html } from "@web/helpers/webComponents";

/**
 * Class for the browse page, extends HTMLElement.
 * Displays a grid of all available game deals with filtering and sorting.
 */
export class BrowsePageComponent extends HTMLElement {
    /**
     * Attach the Shadow and render the HTML
     */
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
    }

    /**
     * Render the HTML content from the nav bar, sidebar and BrowseComponent
     *
     * @returns Void
     */
    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <div>
                <webshop-navigation></webshop-navigation>
                <webshop-sidebar></webshop-sidebar>

                <div>
                    <webshop-browse></webshop-browse>
                </div>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-browse", BrowsePageComponent);
