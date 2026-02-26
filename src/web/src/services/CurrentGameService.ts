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
 * Fetches the enriched game detail AND also fetches prices via the
 * prices endpoint as a fallback to ensure prices always display.
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
        const [gameResponse, priceResponse]: [Response, Response] = await Promise.all([
            fetch(`${VITE_API_URL}games/${gameID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }),
            fetch(`${VITE_API_URL}products/prices/${gameID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }),
        ]);

        if (!gameResponse.ok) {
            console.error(`Error fetching game with ID ${gameID}:`, gameResponse.statusText);
            return null;
        }

        const gameData: GameDetailResult = await gameResponse.json() as GameDetailResult;

        // Try to get price data from the prices endpoint
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

        // If we got storeDeals from the enriched endpoint, also use those for price
        // (they may be more accurate as they show the cheapest across all stores)
        if (gameData.storeDeals && gameData.storeDeals.length > 0 && currentPrice === null) {
            let cheapestPrice: number = Infinity;
            let cheapestRetail: number = 0;
            let cheapestSavings: number = 0;

            for (const deal of gameData.storeDeals) {
                const dealPrice: number = parseFloat(deal.price);
                if (dealPrice < cheapestPrice) {
                    cheapestPrice = dealPrice;
                    cheapestRetail = parseFloat(deal.retailPrice);
                    cheapestSavings = parseFloat(deal.savings);
                }
            }

            if (cheapestPrice !== Infinity) {
                currentPrice = cheapestPrice;
                retailPrice = cheapestRetail;
                savingsPercent = cheapestSavings > 0 ? cheapestSavings : null;
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
