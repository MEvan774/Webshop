import { Request, Response } from "express";
import { GameResult, CheapSharkGameDetail } from "@shared/types";
import { CheapSharkService } from "@web/services/CheapSharkService";

/**
 * Class for the current game controller
 */
export class CurrentGameController {
    private readonly cheapSharkService: CheapSharkService = new CheapSharkService();

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
            const gameDetail: CheapSharkGameDetail = await this.cheapSharkService.getGameById(gameID);

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!gameDetail || !gameDetail.info) {
                res.status(404).json({ error: "Game not found" });
                return;
            }

            const game: GameResult = {
                gameId: gameID,
                cheapSharkGameId: gameID,
                SKU: gameDetail.deals[0]?.dealID || gameID,
                title: gameDetail.info.title,
                thumbnail: gameDetail.info.thumb,
                images: null,
                descriptionMarkdown: "",
                descriptionHtml: "",
                url: gameDetail.info.steamAppID
                    ? `https://store.steampowered.com/app/${gameDetail.info.steamAppID}`
                    : "",
                authors: null,
                tags: null,
                reviews: null,
            };

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
