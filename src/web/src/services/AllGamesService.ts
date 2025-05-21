import { GameResult, ProductPrice } from "@shared/types";
import { IGameService } from "@web/interfaces/IGameService";

export class AllGameService implements IGameService {
    /**
     * Haal alle games op uit de database
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

    public async getGamePrices(gameIds: number[]): Promise<Record<number, ProductPrice> | null> {
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

            const pricesById: Record<number, ProductPrice> = await response.json() as Record<number, ProductPrice>;
            console.log(pricesById);
            return pricesById;
        }
        catch (error) {
            console.error("Fout met ophalen prijzen:", error);
            return null;
        }
    }
}
