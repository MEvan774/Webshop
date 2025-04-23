import { Request, Response } from "express";
import { GameResult } from "@shared/types";
import { GamesService } from "@api/services/GamesService";

export class GamesController {
    private readonly _gamesService: GamesService = new GamesService();
    public async getAllGames(req: Request, res: Response): Promise<void> {
        try {
            const games: GameResult[] = await this._gamesService.getAllGames();
            res.status(200).json(games);
        }
        catch (e: unknown) {
            res.status(500).json({ error: "Failed to fetch users", details: e instanceof Error ? e.message : "Unknown error" });
        }
    }
}
