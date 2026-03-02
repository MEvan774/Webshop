/**
 * Raw response shape from the Steam Store appdetails endpoint.
 * Only the fields we actually use are typed here.
 */
export type SteamAppDetails = {
    type: string;
    name: string;
    steam_appid: number;
    is_free: boolean;
    required_age: number | string;
    content_descriptors?: { ids: number[]; notes: string | null };
    detailed_description: string;
    about_the_game: string;
    short_description: string;
    header_image: string;
    website: string | null;
    developers?: string[];
    publishers?: string[];
    price_overview?: {
        currency: string;
        initial: number;
        final: number;
        discount_percent: number;
        initial_formatted: string;
        final_formatted: string;
    };
    platforms: { windows: boolean; mac: boolean; linux: boolean };
    metacritic?: { score: number; url: string };
    categories?: { id: number; description: string }[];
    genres?: { id: string; description: string }[];
    screenshots?: { id: number; path_thumbnail: string; path_full: string }[];
    movies?: { id: number; name: string; thumbnail: string; webm: { max: string } }[];
    recommendations?: { total: number };
    release_date?: { coming_soon: boolean; date: string };
};

/**
 * Shape of a single item from the featuredcategories endpoint
 * (used by specials, top_sellers, new_releases, coming_soon).
 */
export type SteamFeaturedItem = {
    id: number;
    type: number;
    name: string;
    discounted: boolean;
    discount_percent: number;
    original_price: number | null;
    final_price: number | null;
    currency: string;
    large_capsule_image: string;
    small_capsule_image: string;
    header_image: string;
    windows_available: boolean;
    mac_available: boolean;
    linux_available: boolean;
    /** Content descriptor IDs — ID 3 = adult-only sexual content, ID 4 = frequent violence/gore */
    content_descriptorids?: number[];
};

/**
 * Adult content descriptor IDs used by Steam.
 * 3 = Adult Only Sexual Content
 * 4 = Frequent Violence or Gore
 * 5 = General Mature Content
 */
const ADULT_CONTENT_IDS: number[] = [3, 4, 5];

const STORE_API_BASE: string = "https://store.steampowered.com/api";

/**
 * Service for fetching game data from the Steam Store API.
 * The `appdetails` and `featuredcategories` endpoints require NO API key.
 * Rate-limit: ~200 requests per 5 minutes – callers should cache.
 */
export class SteamStoreService {
    /**
     * Fetch full details for a single Steam app.
     *
     * @param appId The Steam App ID
     * @returns Parsed app details, or null when the store returns success: false
     */
    public async getAppDetails(appId: string): Promise<SteamAppDetails | null> {
        const response: Response = await fetch(
            `${STORE_API_BASE}/appdetails?appids=${encodeURIComponent(appId)}`
        );

        if (!response.ok) {
            throw new Error(`Steam Store API error: ${response.status} ${response.statusText}`);
        }

        const json: Record<string, { success: boolean; data?: SteamAppDetails }> =
            await response.json() as Record<string, { success: boolean; data?: SteamAppDetails }>;

        const entry: { success: boolean; data?: SteamAppDetails } | undefined = json[appId];

        if (!entry.success || !entry.data) {
            return null;
        }

        return entry.data;
    }

    /**
     * Fetch price overview only (lighter call when we just need pricing).
     *
     * @param appId  The Steam App ID
     * @returns Price overview or null
     */
    public async getPriceOverview(
        appId: string
    ): Promise<SteamAppDetails["price_overview"] | null> {
        const response: Response = await fetch(
            `${STORE_API_BASE}/appdetails?appids=${encodeURIComponent(appId)}&filters=price_overview`
        );

        if (!response.ok) {
            throw new Error(`Steam Store API error: ${response.status} ${response.statusText}`);
        }

        const json: Record<string, { success: boolean; data?: { price_overview?: SteamAppDetails["price_overview"] } }> =
            await response.json() as Record<string, { success: boolean; data?: { price_overview?: SteamAppDetails["price_overview"] } }>;

        const entry: { success: boolean; data?: { price_overview?: SteamAppDetails["price_overview"] } } | undefined = json[appId];

        if (!entry.success || !entry.data?.price_overview) {
            return null;
        }

        return entry.data.price_overview;
    }

    /**
     * Search for games by keyword using the Steam store search endpoint.
     * No API key required.
     *
     * @param term  Search query string
     * @param limit Max results
     * @returns Array of {appid, name, img} objects
     */
    public async searchGames(
        term: string,
        limit: number = 10
    ): Promise<{ appid: string; name: string; img: string }[]> {
        const response: Response = await fetch(
            `${STORE_API_BASE}/storesearch/?term=${encodeURIComponent(term)}&l=english&cc=US`
        );

        if (!response.ok) {
            throw new Error(`Steam search API error: ${response.status} ${response.statusText}`);
        }

        const json: { total: number; items: { id: number; name: string; tiny_image: string }[] } =
            await response.json() as { total: number; items: { id: number; name: string; tiny_image: string }[] };

        return json.items.slice(0, limit).map(item => ({
            appid: item.id.toString(),
            name: item.name,
            img: item.tiny_image,
        }));
    }

    /**
     * Get games from the Steam featuredcategories endpoint.
     * Returns top_sellers, specials, new_releases, coming_soon — each with ~20+ items.
     * No key required. Filters out adult/NSFW games by default.
     *
     * @param filterAdult Whether to filter out adult content (default true)
     * @returns Combined array of SteamFeaturedItem from specials + top_sellers + new_releases
     */
    public async getFeaturedGames(filterAdult: boolean = true): Promise<SteamFeaturedItem[]> {
        const response: Response = await fetch(`${STORE_API_BASE}/featuredcategories/`);

        if (!response.ok) {
            throw new Error(`Steam featuredcategories API error: ${response.status} ${response.statusText}`);
        }

        const json: Record<string, { id?: string; name?: string; items?: SteamFeaturedItem[] }> =
            await response.json() as Record<string, { id?: string; name?: string; items?: SteamFeaturedItem[] }>;

        // Combine games from multiple categories for a bigger selection
        const allItems: SteamFeaturedItem[] = [];
        const seenIds: Set<number> = new Set();

        // Priority order: specials (deals) > top_sellers > new_releases
        const categories: string[] = ["specials", "top_sellers", "new_releases"];

        for (const category of categories) {
            const cat: { id?: string; name?: string; items?: SteamFeaturedItem[] } = json[category];
            if (cat.items) {
                for (const item of cat.items) {
                    if (!seenIds.has(item.id)) {
                        seenIds.add(item.id);
                        allItems.push(item);
                    }
                }
            }
        }

        if (!filterAdult) {
            return allItems;
        }

        // Filter out adult content based on content_descriptorids
        return allItems.filter((item: SteamFeaturedItem) => {
            if (!item.content_descriptorids || item.content_descriptorids.length === 0) {
                return true;
            }
            return !item.content_descriptorids.some(
                (id: number) => ADULT_CONTENT_IDS.includes(id)
            );
        });
    }

    /**
     * Check if a Steam app has adult content based on its full details.
     * Use this for the detail page to double-check individual games.
     *
     * @param appDetails The full app details from appdetails endpoint
     * @returns true if the game contains adult content
     */
    public static isAdultContent(appDetails: SteamAppDetails): boolean {
        if (appDetails.content_descriptors?.ids) {
            if (appDetails.content_descriptors.ids.some((id: number) => ADULT_CONTENT_IDS.includes(id))) {
                return true;
            }
        }

        const age: number = typeof appDetails.required_age === "string"
            ? parseInt(appDetails.required_age)
            : appDetails.required_age;

        if (age >= 18) {
            return true;
        }

        return false;
    }
}
