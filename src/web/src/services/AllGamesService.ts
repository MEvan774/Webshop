import { GameResult, ProductPrice } from "@shared/types";
import { IGameService } from "@web/interfaces/IGameService";

/**
 * Service for fetching game data and prices.
 * The API backend now proxies CheapShark, so no frontend changes needed
 * for the actual fetch URLs - they stay the same.
 */
export class AllGameService implements IGameService {
    /**
     * Haal alle games op (nu via CheapShark achter de API)
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

            const gameData: GameResult[] = await response.json() as GameResult[];
            return gameData;
        }
        catch (error) {
            console.error("Netwerk- of serverfout:", error);
            return [];
        }
    }

    /**
     * Haal prijzen op voor een lijst van game IDs (nu via CheapShark achter de API)
     *
     * @param gameIds Array of game IDs (now strings from CheapShark)
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
