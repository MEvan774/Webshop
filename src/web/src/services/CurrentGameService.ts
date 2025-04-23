import { GameResult } from "@shared/types";

export async function getGameByID(): Promise<GameResult | null> {
    const gameID: string = localStorage.getItem("gameID") || "37";

    const response: Response = await fetch(`http://localhost:3001/games/${gameID}`, {
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
