import { GameDetailResult, ProductPrice } from "@shared/types";

/**
 * Fetch result containing both the game data and its price info.
 */
export type GamePageData = {
    game: GameDetailResult;
    /** The best (cheapest) current price found, or null */
    currentPrice: number | null;
    /** The normal retail price, or null */
    retailPrice: number | null;
    /** Savings percentage, or null */
    savingsPercent: number | null;
};

/**
 * Get the current game for currentGameComponent.ts with the gameID.
 * Fetches the enriched game detail from Steam Store API + SteamSpy
 * AND also fetches prices via the prices endpoint to ensure prices always display.
 *
 * @returns The game page data, or null if no game is found
 */
export async function getGamePageData(): Promise<GamePageData | null> {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const gameID: string | null = urlParams.get("gameId");

    if (!gameID) {
        console.error("Geen gameId gevonden in de URL");
        return null;
    }

    try {
        // Fetch game detail and prices in parallel
        const API_BASE: string = (import.meta as unknown as { env: { VITE_API_URL: string } }).env.VITE_API_URL;

        const [gameResponse, priceResponse]: [Response, Response] = await Promise.all([
            fetch(`${API_BASE}games/${gameID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }),
            fetch(`${API_BASE}products/prices/${gameID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }),
        ]);

        if (!gameResponse.ok) {
            console.error(`Error fetching game with ID ${gameID}:`, gameResponse.statusText);
            return null;
        }

        const gameData: GameDetailResult = await gameResponse.json() as GameDetailResult;

        // Try to get price data from the prices endpoint (Steam Store prices)
        let currentPrice: number | null = null;
        let retailPrice: number | null = null;
        let savingsPercent: number | null = null;

        if (priceResponse.ok) {
            const pricesById: Record<string, ProductPrice> = await priceResponse.json() as Record<string, ProductPrice>;
            const priceData: ProductPrice | undefined = pricesById[gameID];

            currentPrice = priceData.price;
            retailPrice = priceData.normalPrice;

            const savingsValue: number = parseFloat(priceData.savings);
            if (savingsValue > 0) {
                savingsPercent = savingsValue;
            }
        }

        return {
            game: gameData,
            currentPrice: currentPrice,
            retailPrice: retailPrice,
            savingsPercent: savingsPercent,
        };
    }
    catch (error: unknown) {
        console.error("Error fetching game page data:", error);
        return null;
    }
}
