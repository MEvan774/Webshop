import { GameResult } from "@shared/types";

/**
 * Get the current game for currentGameComponent.ts with the gameID
 * Now fetches from CheapShark via the API backend.
 *
 * @returns The game as GameResult, or null if no game is found
 */
export async function getGameByID(): Promise<GameResult | null> {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const gameID: string | null = urlParams.get("gameId");

    if (!gameID) {
        console.error("Geen gameId gevonden in de URL");
        return null;
    }

    try {
        const response: Response = await fetch(`${VITE_API_URL}games/${gameID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            console.error(`Error fetching game with ID ${gameID}:`, response.statusText);
            return null;
        }

        const gameData: GameResult = await response.json() as GameResult;
        return gameData;
    }
    catch (error) {
        console.error("Error fetching game:", error);
        return null;
    }
}
