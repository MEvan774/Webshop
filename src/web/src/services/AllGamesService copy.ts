import { GameResult } from "@shared/types";

/**
 * Haal alle games op uit de database
 *
 * @returns Een array met games, of een lege array bij fout
 */
export async function getAllGames(): Promise<GameResult[]> {
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
