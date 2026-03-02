/**
 * Raw response shape from the Steam Store appdetails endpoint.
 * Only the fields we actually use are typed here.
 */
export type SteamAppDetails = {
    type: string;
    name: string;
    steam_appid: number;
    is_free: boolean;
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
 * Minimal result from IStoreService/GetAppList used for searching / browsing.
 */
export type SteamAppListItem = {
    appid: number;
    name: string;
    last_modified: number;
    price_change_number: number;
};

const STORE_API_BASE: string = "https://store.steampowered.com/api";

/**
 * Service for fetching game data from the Steam Store API.
 * The `appdetails` endpoint requires NO API key.
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
     * Search for games by keyword using the Steam store search suggest endpoint.
     * This is an undocumented but publicly available endpoint that requires no key.
     *
     * @param term  Search query string
     * @param limit Max results
     * @returns Array of {appid, name, img} objects
     */
    public async searchGames(
        term: string,
        limit: number = 10
    ): Promise<{ appid: string; name: string; img: string }[]> {
        // The storesearch endpoint returns HTML, but the search/suggest endpoint
        // returns JSON-ish data. We use the storefront search API instead.
        const response: Response = await fetch(
            `${STORE_API_BASE}/storesearch/?term=${encodeURIComponent(term)}&l=english&cc=US`
        );

        if (!response.ok) {
            throw new Error(`Steam search API error: ${response.status} ${response.statusText}`);
        }

        const json: { total: number; items: { id: number; name: string; tiny_image: string }[] } =
            await response.json() as { total: number; items: { id: number; name: string; tiny_image: string }[] };

        return json.items.slice(0, limit).map((item: { id: number; name: string; tiny_image: string }) => ({
            appid: item.id.toString(),
            name: item.name,
            img: item.tiny_image,
        }));
    }

    /**
     * Get a list of featured / top-selling games from the Steam storefront.
     * No key required.
     *
     * @returns Array of featured app details
     */
    public async getFeaturedGames(): Promise<{ id: number; name: string; discounted: boolean; discount_percent: number; original_price: number | null; final_price: number | null; large_capsule_image: string; header_image: string }[]> {
        const response: Response = await fetch(`${STORE_API_BASE}/featured/`);

        if (!response.ok) {
            throw new Error(`Steam featured API error: ${response.status} ${response.statusText}`);
        }

        const json: {
            featured_win: {
                id: number; name: string; discounted: boolean; discount_percent: number;
                original_price: number | null; final_price: number | null;
                large_capsule_image: string; header_image: string;
            }[];
        } = await response.json() as {
            featured_win: {
                id: number; name: string; discounted: boolean; discount_percent: number;
                original_price: number | null; final_price: number | null;
                large_capsule_image: string; header_image: string;
            }[];
        };

        return json.featured_win;
    }
}
