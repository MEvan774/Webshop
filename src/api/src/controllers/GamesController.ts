import { Request, Response } from "express";
import { CheapSharkDeal, CheapSharkGameDeal, CheapSharkGameDetail, CheapSharkGameSearch, CheapSharkStore, GameResult, ProductPrice } from "@shared/types";
import { CheapSharkService } from "@web/services/CheapSharkService";

/**
 * Controller for game-related endpoints.
 * Now uses CheapShark API instead of local database + OegeDockerService.
 */
export class GamesController {
    private readonly _cheapSharkService: CheapSharkService = new CheapSharkService();

    /**
     * GET /products - Get all games (deals list)
     * Maps CheapShark deals to the GameResult format for backward compatibility.
     */
    public async getAllGames(req: Request, res: Response): Promise<void> {
        try {
            const page: number = parseInt(req.query.page as string) || 0;
            const pageSize: number = parseInt(req.query.pageSize as string) || 40;
            const sortBy: string = (req.query.sortBy as string) || "Deal Rating";

            const deals: CheapSharkDeal[] = await this._cheapSharkService.getDeals(page, pageSize, sortBy);

            // Map CheapShark deals to GameResult format for frontend compatibility
            const games: GameResult[] = deals.map((deal: CheapSharkDeal) => this.mapDealToGameResult(deal));

            res.status(200).json(games);
        }
        catch (e: unknown) {
            console.error("Error fetching games from CheapShark:", e);
            res.status(500).json({
                error: "Failed to fetch games",
                details: e instanceof Error ? e.message : "Unknown error",
            });
        }
    }

    /**
     * GET /games/:gameID - Get a specific game by CheapShark game ID
     * Returns detailed game info including deals from multiple stores.
     */
    public async getGameById(req: Request, res: Response): Promise<void> {
        const { gameID } = req.params;

        try {
            const gameDetail: CheapSharkGameDetail = await this._cheapSharkService.getGameById(gameID);

            // Map to GameResult format
            const game: GameResult = {
                gameId: gameID,
                cheapSharkGameId: gameID,
                SKU: gameDetail.deals[0]?.dealID || gameID,
                title: gameDetail.info.title,
                thumbnail: gameDetail.info.thumb,
                images: null,
                descriptionMarkdown: "",
                descriptionHtml: "",
                url: gameDetail.info.steamAppID
                    ? `https://store.steampowered.com/app/${gameDetail.info.steamAppID}`
                    : "",
                authors: null,
                tags: null,
                reviews: null,
            };

            res.status(200).json(game);
        }
        catch (e: unknown) {
            console.error("Error fetching game from CheapShark:", e);
            res.status(500).json({
                error: "Failed to fetch game",
                details: e instanceof Error ? e.message : "Unknown error",
            });
        }
    }

    /**
     * GET /products/prices/:gameId - Get prices for a game from all stores
     * Returns an object of ProductPrice mapped from CheapShark deals.
     */
    public async getProductPrices(req: Request, res: Response): Promise<void> {
        const { gameId } = req.params;

        try {
            // Support comma-separated game IDs
            const gameIds: string[] = gameId.split(",");

            const pricesById: Record<string, ProductPrice> = {};

            for (const id of gameIds) {
                const trimmedId: string = id.trim();
                const gameDetail: CheapSharkGameDetail = await this._cheapSharkService.getGameById(trimmedId);

                if (gameDetail.deals.length > 0) {
                    // Use the cheapest deal as the main price
                    const cheapestDeal: CheapSharkGameDeal = gameDetail.deals.reduce(
                        (min: CheapSharkGameDeal, deal: CheapSharkGameDeal) =>
                            parseFloat(deal.price) < parseFloat(min.price) ? deal : min,
                        gameDetail.deals[0]
                    );

                    pricesById[trimmedId] = {
                        price: parseFloat(cheapestDeal.retailPrice),
                        productId: trimmedId,
                        currency: "USD",
                        normalPrice: parseFloat(cheapestDeal.retailPrice),
                        savings: cheapestDeal.savings,
                        storeID: cheapestDeal.storeID,
                    };
                }
            }

            res.status(200).json(pricesById);
        }
        catch (e: unknown) {
            console.error("Error fetching prices from CheapShark:", e);
            res.status(500).json({
                error: "Failed to fetch prices",
                details: e instanceof Error ? e.message : "Unknown error",
            });
        }
    }

    /**
     * GET /games/search?title={title} - Search games by title
     */
    public async searchGames(req: Request, res: Response): Promise<void> {
        const title: string = req.query.title as string;

        if (!title) {
            res.status(400).json({ error: "Title query parameter is required" });
            return;
        }

        try {
            const results: CheapSharkGameSearch[] = await this._cheapSharkService.searchGames(title);

            // Map CheapSharkGameSearch to GameResult format for frontend compatibility
            const games: GameResult[] = results.map((result: CheapSharkGameSearch): GameResult => ({
                gameId: result.gameID,
                cheapSharkGameId: result.gameID,
                SKU: result.cheapestDealID,
                title: result.external,
                thumbnail: result.thumb,
                images: null,
                descriptionMarkdown: "",
                descriptionHtml: "",
                url: result.steamAppID
                    ? `https://store.steampowered.com/app/${result.steamAppID}`
                    : `https://www.cheapshark.com/redirect?dealID=${result.cheapestDealID}`,
                authors: null,
                tags: null,
                reviews: null,
            }));

            res.status(200).json(games);
        }
        catch (e: unknown) {
            console.error("Error searching games:", e);
            res.status(500).json({
                error: "Failed to search games",
                details: e instanceof Error ? e.message : "Unknown error",
            });
        }
    }

    /**
     * GET /stores - Get all stores tracked by CheapShark
     */
    public async getStores(_req: Request, res: Response): Promise<void> {
        try {
            const stores: CheapSharkStore[] = await this._cheapSharkService.getStores();
            res.status(200).json(stores);
        }
        catch (e: unknown) {
            console.error("Error fetching stores:", e);
            res.status(500).json({
                error: "Failed to fetch stores",
                details: e instanceof Error ? e.message : "Unknown error",
            });
        }
    }

    /**
     * Maps a CheapShark deal to the existing GameResult format.
     * This ensures backward compatibility with the frontend.
     */
    private mapDealToGameResult(deal: CheapSharkDeal): GameResult {
        return {
            gameId: deal.gameID,
            cheapSharkGameId: deal.gameID,
            SKU: deal.dealID,
            title: deal.title,
            thumbnail: deal.thumb,
            images: null,
            descriptionMarkdown: "",
            descriptionHtml: "",
            url: deal.steamAppID
                ? `https://store.steampowered.com/app/${deal.steamAppID}`
                : `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`,
            authors: null,
            tags: deal.steamRatingText ? [deal.steamRatingText] : null,
            reviews: deal.metacriticScore && deal.metacriticScore !== "0"
                ? [`Metacritic: ${deal.metacriticScore}`]
                : null,
        };
    }
}
