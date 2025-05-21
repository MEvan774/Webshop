import { GameResult } from "@shared/types";

/**
 * Get the current game for currentGameComponent.ts with the gameID
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
