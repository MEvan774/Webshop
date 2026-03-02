import { GameResult, ProductPrice } from "@shared/types";
import { IGameService } from "@web/interfaces/IGameService";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
const VITE_API_URL: string = (import.meta as any).env.VITE_API_URL as string;

/**
 * Service for fetching game data and prices.
 * The API backend now proxies Steam Store API + SteamSpy.
 *
 * The /products endpoint returns both games AND prices bundled together,
 * so the browse page can load everything in a single request.
 */
export class AllGameService implements IGameService {
    /**
     * Haal alle games op.
     * The backend now returns { games, prices } but this method
     * returns only the games array for backward compatibility
     * with WelcomeComponent and other consumers.
     *
     * @returns Een array met games, of een lege array bij fout
     */
    public async getAllGames(): Promise<GameResult[]> {
        try {
            const response: Response = await fetch(`${VITE_API_URL}products`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                console.error("Fout bij ophalen van games:", response.statusText);
                return [];
            }

            const data: { games: GameResult[]; prices: Record<string, ProductPrice> } =
                await response.json() as { games: GameResult[]; prices: Record<string, ProductPrice> };

            return data.games;
        }
        catch (error) {
            console.error("Netwerk- of serverfout:", error);
            return [];
        }
    }

    /**
     * Haal alle games én hun prijzen op in één keer.
     * Used by BrowseComponent to avoid separate price-fetching calls.
     *
     * @returns Object with games array and prices record, or null on error
     */
    public async getAllGamesWithPrices(): Promise<{ games: GameResult[]; prices: Record<string, ProductPrice> } | null> {
        try {
            const response: Response = await fetch(`${VITE_API_URL}products`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                console.error("Fout bij ophalen van games:", response.statusText);
                return null;
            }

            const data: { games: GameResult[]; prices: Record<string, ProductPrice> } =
                await response.json() as { games: GameResult[]; prices: Record<string, ProductPrice> };

            return data;
        }
        catch (error) {
            console.error("Netwerk- of serverfout:", error);
            return null;
        }
    }

    /**
     * Haal prijzen op voor een lijst van game IDs.
     * Still used by WelcomeComponent and CurrentGameService for
     * individual or small-batch price lookups.
     *
     * @param gameIds Array of game IDs (Steam App IDs as strings)
     * @returns Record van gameId naar ProductPrice, of null bij fout
     */
    public async getGamePrices(gameIds: string[]): Promise<Record<string, ProductPrice> | null> {
        try {
            const response: Response = await fetch(`${VITE_API_URL}products/prices/${gameIds.join(",")}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error("Fout bij het ophalen van prijzen:", response.statusText);
                return null;
            }

            const pricesById: Record<string, ProductPrice> = await response.json() as Record<string, ProductPrice>;
            return pricesById;
        }
        catch (error) {
            console.error("Fout met ophalen prijzen:", error);
            return null;
        }
    }

    /**
     * Zoek games op titel (nieuw endpoint)
     *
     * @param title De zoekterm
     * @returns Array van zoekresultaten
     */
    public async searchGames(title: string): Promise<GameResult[]> {
        try {
            const response: Response = await fetch(
                `${VITE_API_URL}games/search?title=${encodeURIComponent(title)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                console.error("Fout bij zoeken van games:", response.statusText);
                return [];
            }

            return await response.json() as GameResult[];
        }
        catch (error) {
            console.error("Zoekfout:", error);
            return [];
        }
    }
}
