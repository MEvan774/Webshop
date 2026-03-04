/**
 * Represents the current filter state dispatched by the sidebar.
 */
export interface FilterData {
    /** Minimum price filter (null means no minimum) */
    minPrice: number | null;
    /** Maximum price filter (null means no maximum) */
    maxPrice: number | null;
    /** Selected label/tag filters */
    labels: string[];
    /** Sort option (null means keep current/default) */
    sortBy: string | null;
    /** Minimum discount percentage filter (null means no minimum discount) */
    minDiscount: number | null;
    /** Whether to show only free games */
    freeOnly: boolean;
}
