export class SidebarComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = ""; // Clear previous

        const element: HTMLElement = document.createElement("div");
        element.innerHTML = `
            <input type="checkbox" id="sidebar-toggle" hidden />
            <label for="sidebar-toggle" class="sidebar-btn">
                <img src="/assets/img/ui/Arrow.svg">
            </label>

            <section>
                <div class="sidebar">
                    <div class="sidebar-content">
                        <h2>Filters</h2>
                        <h3>Prijs</h3>
                        <div class="price-range-boxes">
                            <label><input type="number" class="price-input" id="min-price" placeholder="min" /></label>
                            <span>—</span>
                            <label><input type="number" class="price-input" id="max-price" placeholder="max" /></label>
                        </div>
                        <h3>Labels</h3>
                        <div class="checkbox-grid">
                            <label><input class="checkbox" type="checkbox" value="Action" /> Actie</label>
                            <label><input class="checkbox" type="checkbox" value="Adventure" /> Avontuur</label>
                            <label><input class="checkbox" type="checkbox" value="RPG" /> RPG</label>
                            <label><input class="checkbox" type="checkbox" value="Horror" /> Horror</label>
                            <label><input class="checkbox" type="checkbox" value="Survival" /> Overleven</label>
                            <label><input class="checkbox" type="checkbox" value="Medieval" /> Middeleeuws</label>
                        </div>
                    </div>
                </div>
            </section>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/sidebar.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);

        // Add toggle logic
        const checkbox: HTMLInputElement | null = this.shadowRoot.querySelector<HTMLInputElement>("#sidebar-toggle");
        const sidebar: HTMLElement | null = this.shadowRoot.querySelector<HTMLElement>(".sidebar");
        const btn: HTMLElement | null = this.shadowRoot.querySelector<HTMLElement>(".sidebar-btn");

        checkbox?.addEventListener("change", () => {
            const isOpen: boolean = checkbox.checked;

            if (isOpen) {
                sidebar?.classList.add("open");
                btn?.classList.add("shifted", "open");
            }
            else {
                sidebar?.classList.remove("open");
                btn?.classList.remove("shifted", "open");
            }
        });
    }
}

window.customElements.define("webshop-sidebar", SidebarComponent);
