import { Request, Response } from "express";
import { GameResult, ProductPrice } from "@shared/types";
import { GamesService } from "@api/services/GamesService";
import { OegeDockerService } from "@api/services/OegeDockerService";

export class GamesController {
    private readonly _gamesService: GamesService = new GamesService();
    private readonly _oegeDockerService: OegeDockerService = new OegeDockerService();
    public async getAllGames(_req: Request, res: Response): Promise<void> {
        try {
            const games: GameResult[] = await this._gamesService.getAllGames();
            res.status(200).json(games);
        }
        catch (e: unknown) {
            res.status(500).json({ error: "Failed to fetch users", details: e instanceof Error ? e.message : "Unknown error" });
        }
    }

    public async getProductPrice(gameId: string, res: Response): Promise<ProductPrice[] | undefined> {
        try {
            const port: number = 8580;
            const path: string = `productprices/${gameId}`;
            const productPrices: ProductPrice[] = await this._oegeDockerService.connectAPI<ProductPrice[]>(port, path);
            return productPrices;
        }
        catch (e: unknown) {
            res.status(500).json({ error: "Failed to fetch external prices", details: e instanceof Error ? e.message : "Unknown error" });
            return undefined;
        }
    }
}
