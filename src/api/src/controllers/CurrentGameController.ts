import { Request, Response } from "express";
import { getGameWithGameID } from "@api/services/CurrentGameService";
import { GameResult } from "@shared/types";
import { GamesService } from "@api/services/GamesService";

/**
 * Class for the current game controller
 */
export class CurrentGameController {
    private readonly gameService: GamesService = new GamesService();

    /**
     * Get the current game with the gameID
     *
     * @param req Request with the gameID in the params
     * @param res Response to send the status to
     * @returns Void
     */
    public async getGameByID(req: Request, res: Response): Promise<void> {
        const { gameID } = req.params;

        try {
            const game: GameResult | null = await getGameWithGameID(gameID);

            if (!game) {
                res.status(404).json({ error: "Game not found" });
                return;
            }

            res.json(game);
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Failed to fetch game:", error.message);
                res.status(500).json({ error: error.message });
            }
            else {
                console.error("Unexpected error:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    public async getGameBySKU(SKU: string, res: Response): Promise<void> {
        try {
            const game: GameResult | null = await this.gameService.getGameWithSKU(SKU);

            if (!game) {
                res.status(404).json({ error: "Game not found" });
                return;
            }

            res.json(game);
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Failed to fetch game:", error.message);
                res.status(500).json({ error: error.message });
            }
            else {
                console.error("Unexpected error:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }
}
