import { Request, Response } from "express";
import { getGameWithGameID } from "@api/services/CurrentGameService";
import { GameResult } from "@shared/types";

export class CurrentGameController {
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
}
