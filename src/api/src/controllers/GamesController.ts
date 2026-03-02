import { Request, Response } from "express";
import { GameDetailResult, GameResult, ProductPrice } from "@shared/types";
import { SteamStoreService, SteamAppDetails, SteamFeaturedItem } from "@api/services/SteamStoreService";
import { SteamSpyService, SteamSpyAppDetails } from "@api/services/SteamSpyService";

/**
 * Controller for game-related endpoints.
 * Now uses Steam Store API + SteamSpy instead of CheapShark.
 *
 * - Steam Store `featuredcategories` → browse/landing page game lists (specials, top_sellers, new_releases)
 * - Steam Store `appdetails` → game detail page metadata
 * - SteamSpy → positive/negative reviews to derive steam ratings + tags
 */
export class GamesController {
    private readonly _steamStoreService: SteamStoreService = new SteamStoreService();
    private readonly _steamSpyService: SteamSpyService = new SteamSpyService();

    /**
     * GET /products - Get all games (featured / popular list).
     * Uses Steam featuredcategories endpoint which returns specials, top_sellers,
     * and new_releases — typically 40-60+ games combined.
     * Filters out adult/NSFW content.
     */
    public async getAllGames(_req: Request, res: Response): Promise<void> {
        try {
            const featured: SteamFeaturedItem[] = await this._steamStoreService.getFeaturedGames(true);

            // Map featured games to GameResult format
            const games: GameResult[] = featured.map((app: SteamFeaturedItem): GameResult => ({
                gameId: app.id.toString(),
                steamAppId: app.id.toString(),
                SKU: app.id.toString(),
                title: app.name,
                thumbnail: app.header_image || app.large_capsule_image || app.small_capsule_image,
                images: null,
                descriptionMarkdown: "",
                descriptionHtml: "",
                url: `https://store.steampowered.com/app/${app.id}`,
                authors: null,
                tags: null,
                reviews: null,
            }));

            res.status(200).json(games);
        }
        catch (e: unknown) {
            console.error("Error fetching featured games from Steam:", e);
            res.status(500).json({
                error: "Failed to fetch games",
                details: e instanceof Error ? e.message : "Unknown error",
            });
        }
    }

    /**
     * GET /games/:gameID - Get a specific game by Steam App ID.
     * Combines Steam Store appdetails + SteamSpy for full detail.
     * Returns a GameDetailResult for the game detail page.
     */
    public async getGameById(req: Request, res: Response): Promise<void> {
        const { gameID } = req.params;

        try {
            // Fetch Steam Store details and SteamSpy data in parallel
            const [storeData, spyData]: [SteamAppDetails | null, SteamSpyAppDetails] =
                await Promise.all([
                    this._steamStoreService.getAppDetails(gameID),
                    this._steamSpyService.getAppDetails(gameID),
                ]);

            if (!storeData) {
                res.status(404).json({ error: "Game not found on Steam Store" });
                return;
            }

            // Derive Steam rating from SteamSpy positive/negative counts
            const totalReviews: number = spyData.positive + spyData.negative;
            const ratingPercent: string = totalReviews > 0
                ? ((spyData.positive / totalReviews) * 100).toFixed(0)
                : "0";
            const ratingText: string = SteamSpyService.deriveRatingText(
                spyData.positive,
                spyData.negative
            );

            // Parse release date to Unix timestamp
            let releaseTimestamp: number | null = null;
            if (storeData.release_date?.date) {
                const parsed: number = Date.parse(storeData.release_date.date);
                if (!isNaN(parsed)) {
                    releaseTimestamp = Math.floor(parsed / 1000);
                }
            }

            // Build tags from Steam genres + SteamSpy tags
            const tags: string[] = [];
            if (storeData.genres) {
                for (const genre of storeData.genres) {
                    tags.push(genre.description);
                }
            }
            for (const tagName of Object.keys(spyData.tags)) {
                if (!tags.includes(tagName)) {
                    tags.push(tagName);
                }
            }

            // Build the full GameDetailResult
            const game: GameDetailResult = {
                gameId: gameID,
                steamAppId: gameID,
                SKU: gameID,
                title: storeData.name,
                thumbnail: storeData.header_image,
                images: storeData.screenshots
                    ? storeData.screenshots.map(s => s.path_full)
                    : null,
                descriptionMarkdown: storeData.short_description || "",
                descriptionHtml: storeData.detailed_description || "",
                url: `https://store.steampowered.com/app/${gameID}`,
                authors: storeData.developers || storeData.publishers || null,
                tags: tags.length > 0 ? tags : null,
                reviews: storeData.recommendations
                    ? [`${storeData.recommendations.total} recommendations`]
                    : null,

                // Extended detail fields
                steamRatingText: ratingText,
                steamRatingPercent: ratingPercent,
                steamRatingCount: totalReviews.toString(),
                metacriticScore: storeData.metacritic
                    ? storeData.metacritic.score.toString()
                    : null,
                metacriticLink: storeData.metacritic
                    ? storeData.metacritic.url
                    : null,
                releaseDate: releaseTimestamp,
                cheapestPriceEver: null,
                storeDeals: null,
            };

            res.status(200).json(game);
        }
        catch (e: unknown) {
            console.error("Error fetching game detail:", e);
            res.status(500).json({
                error: "Failed to fetch game",
                details: e instanceof Error ? e.message : "Unknown error",
            });
        }
    }

    /**
     * GET /products/prices/:gameId - Get prices for one or more games.
     * Uses the Steam Store appdetails price_overview filter for lightweight price fetches.
     * Supports comma-separated game IDs.
     */
    public async getProductPrices(req: Request, res: Response): Promise<void> {
        const { gameId } = req.params;

        try {
            const gameIds: string[] = gameId.split(",");
            const pricesById: Record<string, ProductPrice> = {};

            for (const id of gameIds) {
                const trimmedId: string = id.trim();

                try {
                    const priceData: SteamAppDetails["price_overview"] | null = await this._steamStoreService.getPriceOverview(trimmedId);

                    if (priceData) {
                        // Steam prices are in cents, convert to whole units
                        const finalPrice: number = priceData.final / 100;
                        const initialPrice: number = priceData.initial / 100;
                        const savings: number = priceData.discount_percent;

                        pricesById[trimmedId] = {
                            price: finalPrice,
                            productId: trimmedId,
                            currency: priceData.currency,
                            normalPrice: initialPrice,
                            savings: savings.toString(),
                            storeID: "steam",
                        };
                    }
                    else {
                        // Game might be free or not found
                        pricesById[trimmedId] = {
                            price: 0,
                            productId: trimmedId,
                            currency: "USD",
                            normalPrice: 0,
                            savings: "0",
                            storeID: "steam",
                        };
                    }
                }
                catch (priceError: unknown) {
                    console.error(`Error fetching price for ${trimmedId}:`, priceError);
                }
            }

            res.status(200).json(pricesById);
        }
        catch (e: unknown) {
            console.error("Error fetching prices:", e);
            res.status(500).json({
                error: "Failed to fetch prices",
                details: e instanceof Error ? e.message : "Unknown error",
            });
        }
    }

    /**
     * GET /games/search?title={title} - Search games by title.
     * Uses the Steam storesearch endpoint (no key required).
     */
    public async searchGames(req: Request, res: Response): Promise<void> {
        const title: string = req.query.title as string;

        if (!title) {
            res.status(400).json({ error: "Title query parameter is required" });
            return;
        }

        try {
            const results: { appid: string; name: string; img: string }[] = await this._steamStoreService.searchGames(title, 20);

            const games: GameResult[] = results.map((result): GameResult => ({
                gameId: result.appid,
                steamAppId: result.appid,
                SKU: result.appid,
                title: result.name,
                thumbnail: result.img,
                images: null,
                descriptionMarkdown: "",
                descriptionHtml: "",
                url: `https://store.steampowered.com/app/${result.appid}`,
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
}
