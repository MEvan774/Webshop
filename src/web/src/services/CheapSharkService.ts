import { CheapSharkDeal, CheapSharkGameDetail, CheapSharkGameSearch, CheapSharkStore } from "@shared/types";

const CHEAPSHARK_BASE_URL: string = "https://www.cheapshark.com/api/1.0";

/**
 * Service for fetching game data and prices from CheapShark API.
 * Replaces GamesService (database) and OegeDockerService (external prices).
 */
export class CheapSharkService {
    /**
     * Get a list of game deals (main listing for homepage).
     *
     * @param pageNumber Page number (default 0)
     * @param pageSize Number of deals per page (default 20, max 60)
     * @param sortBy Sort criteria (default "Deal Rating")
     * @param onSale Only show games on sale (default true)
     * @returns Array of CheapSharkDeal
     */
    public async getDeals(
        pageNumber: number = 0,
        pageSize: number = 20,
        sortBy: string = "Deal Rating",
        onSale: boolean = true
    ): Promise<CheapSharkDeal[]> {
        const params: URLSearchParams = new URLSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
            sortBy: sortBy,
            ...(onSale ? { onSale: "1" } : {}),
        });

        const response: Response = await fetch(`${CHEAPSHARK_BASE_URL}/deals?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`CheapShark API error: ${response.status} ${response.statusText}`);
        }

        return await response.json() as CheapSharkDeal[];
    }

    /**
     * Get a specific deal by dealID.
     *
     * @param dealID The deal ID string
     * @returns The deal details
     */
    public async getDealById(dealID: string): Promise<CheapSharkDeal> {
        const response: Response = await fetch(`${CHEAPSHARK_BASE_URL}/deals?id=${encodeURIComponent(dealID)}`);

        if (!response.ok) {
            throw new Error(`CheapShark API error: ${response.status} ${response.statusText}`);
        }

        return await response.json() as CheapSharkDeal;
    }

    /**
     * Get game details by CheapShark game ID (includes price history and deals across stores).
     *
     * @param gameId The CheapShark game ID
     * @returns Game detail with deals from all stores
     */
    public async getGameById(gameId: string): Promise<CheapSharkGameDetail> {
        const response: Response = await fetch(`${CHEAPSHARK_BASE_URL}/games?id=${encodeURIComponent(gameId)}`);

        if (!response.ok) {
            throw new Error(`CheapShark API error: ${response.status} ${response.statusText}`);
        }

        return await response.json() as CheapSharkGameDetail;
    }

    /**
     * Search games by title.
     *
     * @param title The search title
     * @param limit Max results (default 10, max 60)
     * @param exact Exact match only
     * @returns Array of game search results
     */
    public async searchGames(
        title: string,
        limit: number = 10,
        exact: boolean = false
    ): Promise<CheapSharkGameSearch[]> {
        const params: URLSearchParams = new URLSearchParams({
            title: title,
            limit: limit.toString(),
            ...(exact ? { exact: "1" } : {}),
        });

        const response: Response = await fetch(`${CHEAPSHARK_BASE_URL}/games?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`CheapShark API error: ${response.status} ${response.statusText}`);
        }

        return await response.json() as CheapSharkGameSearch[];
    }

    /**
     * Get all stores tracked by CheapShark.
     *
     * @returns Array of stores
     */
    public async getStores(): Promise<CheapSharkStore[]> {
        const response: Response = await fetch(`${CHEAPSHARK_BASE_URL}/stores`);

        if (!response.ok) {
            throw new Error(`CheapShark API error: ${response.status} ${response.statusText}`);
        }

        return await response.json() as CheapSharkStore[];
    }
}
