import { WebshopEvent } from "@web/enums/WebshopEvent";
import { WebshopEventService } from "@web/services/WebshopEventService";
import { FilterData } from "@web/types/FilterData";

/**
 * Sidebar component with price range and label filters.
 * Dispatches a FilterChange event whenever the user changes any filter.
 */
export class SidebarComponent extends HTMLElement {
    private readonly _eventService: WebshopEventService = new WebshopEventService();

    /** Debounce timer for price input */
    private priceDebounceTimer: number | null = null;

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
                        <h3>Sorteer op</h3>
                        <div class="sort-select-wrapper">
                            <select id="sidebar-sort" class="sidebar-sort-select">
                                <option value="Deal Rating">Beste deal</option>
                                <option value="title-az">Titel A–Z</option>
                                <option value="title-za">Titel Z–A</option>
                                <option value="price-low">Prijs laag–hoog</option>
                                <option value="price-high">Prijs hoog–laag</option>
                            </select>
                        </div>
                        <h3>Prijs</h3>
                        <div class="price-range-boxes">
                            <label><input type="number" class="price-input" id="min-price" placeholder="min" min="0" /></label>
                            <span>—</span>
                            <label><input type="number" class="price-input" id="max-price" placeholder="max" min="0" /></label>
                        </div>
                        <h3>Beoordeling</h3>
                        <div class="sort-select-wrapper">
                            <select id="sidebar-sort" class="sidebar-sort-select">
                                <option value="Overwhelmingly Positive">Overweldigend positief</option>
                                <option value="Very Positive">Zeer positief</option>
                                <option value="Mostly Positive">Grotendeels positief</option>
                                <option value="Positive">Positief</option>
                                <option value="Mixed">Gemengd</option>
                                <option value="Negative">Negatief</option>
                            </select>
                        </div>
                        <button class="filter-reset-btn" id="reset-filters">Filters wissen</button>
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

        this.setupToggle();
        this.setupFilterListeners();
    }

    /**
     * Set up the sidebar open/close toggle logic
     */
    private setupToggle(): void {
        if (!this.shadowRoot) return;

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

    /**
     * Set up event listeners on all filter inputs and dispatch FilterChange events
     */
    private setupFilterListeners(): void {
        if (!this.shadowRoot) return;

        const sortSelect: HTMLSelectElement | null = this.shadowRoot.querySelector<HTMLSelectElement>("#sidebar-sort");
        const minPriceInput: HTMLInputElement | null = this.shadowRoot.querySelector<HTMLInputElement>("#min-price");
        const maxPriceInput: HTMLInputElement | null = this.shadowRoot.querySelector<HTMLInputElement>("#max-price");
        const checkboxes: NodeListOf<HTMLInputElement> = this.shadowRoot.querySelectorAll<HTMLInputElement>(".checkbox");
        const resetBtn: HTMLButtonElement | null = this.shadowRoot.querySelector<HTMLButtonElement>("#reset-filters");

        // Sort select: dispatch immediately on change
        sortSelect?.addEventListener("change", () => {
            this.dispatchFilterEvent();
        });

        // Price inputs: debounce to avoid firing on every keystroke
        const handlePriceChange: () => void = (): void => {
            if (this.priceDebounceTimer) {
                window.clearTimeout(this.priceDebounceTimer);
            }

            this.priceDebounceTimer = window.setTimeout(() => {
                this.dispatchFilterEvent();
            }, 400);
        };

        minPriceInput?.addEventListener("input", handlePriceChange);
        maxPriceInput?.addEventListener("input", handlePriceChange);

        // Label checkboxes: dispatch immediately on change
        checkboxes.forEach((cb: HTMLInputElement) => {
            cb.addEventListener("change", () => {
                this.dispatchFilterEvent();
            });
        });

        // Reset button: clear all inputs and dispatch
        resetBtn?.addEventListener("click", () => {
            if (sortSelect) sortSelect.value = "Deal Rating";
            if (minPriceInput) minPriceInput.value = "";
            if (maxPriceInput) maxPriceInput.value = "";

            checkboxes.forEach((cb: HTMLInputElement) => {
                cb.checked = false;
            });

            this.dispatchFilterEvent();
        });
    }

    /**
     * Gather current filter state and dispatch a FilterChange event
     */
    private dispatchFilterEvent(): void {
        if (!this.shadowRoot) return;

        const sortSelect: HTMLSelectElement | null = this.shadowRoot.querySelector<HTMLSelectElement>("#sidebar-sort");
        const minPriceInput: HTMLInputElement | null = this.shadowRoot.querySelector<HTMLInputElement>("#min-price");
        const maxPriceInput: HTMLInputElement | null = this.shadowRoot.querySelector<HTMLInputElement>("#max-price");
        const checkboxes: NodeListOf<HTMLInputElement> = this.shadowRoot.querySelectorAll<HTMLInputElement>(".checkbox:checked");

        const minValue: string = minPriceInput?.value.trim() ?? "";
        const maxValue: string = maxPriceInput?.value.trim() ?? "";

        const filterData: FilterData = {
            minPrice: minValue !== "" ? parseFloat(minValue) : null,
            maxPrice: maxValue !== "" ? parseFloat(maxValue) : null,
            labels: Array.from(checkboxes).map((cb: HTMLInputElement) => cb.value),
            sortBy: sortSelect?.value ?? null,
        };

        this._eventService.dispatchEvent<FilterData>(WebshopEvent.FilterChange, filterData);
    }
}

window.customElements.define("webshop-sidebar", SidebarComponent);
