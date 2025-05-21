import { IGamesService } from "@api/interfaces/IGamesService";
import { GameResult } from "@shared/types";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";

export class GamesService implements IGamesService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async getAllGames(): Promise<GameResult[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: GameResult[] = await this._databaseService.query<GameResult[]>(connection, "SELECT * FROM game");

            const games: GameResult[] = result
                .map((game: GameResult) => {
                    return {
                        gameId: game.gameId,
                        SKU: game.SKU,
                        title: game.title,
                        thumbnail: game.thumbnail,
                        descriptionHtml: game.descriptionHtml,
                        descriptionMarkdown: game.descriptionMarkdown || "", // Default to empty string
                        reviews: game.reviews || [], // Ensure reviews is an array
                        images: game.images || [], // Default to empty array if no images
                        url: game.url || "", // Default to empty string if no URL
                        authors: game.authors || [], // Default to empty array if no authors
                        tags: game.tags || [], // Default to empty array if no tags
                    };
                })
                .filter((game: GameResult | null): game is GameResult => game !== null); // Filter out nulls

            return games;
        }
        catch (e: unknown) {
            // Foutafhandelingsmechanisme
            throw new Error(`Failed to fetch games: ${e instanceof Error ? e.message : "Unknown error"}`);
        }
        finally {
            // Zorg ervoor dat de databaseverbinding altijd wordt vrijgegeven
            connection.release();
        }
    }

    /**
     * Get the game with the SKU
     *
     * @param SKU The SKU of the game as string
     * @returns GameResult of the game, or null if no game is found
     */
    public async getGameWithSKU(SKU: string): Promise<GameResult | null> {
        const databaseService: DatabaseService = new DatabaseService();
        const connection: PoolConnection = await databaseService.openConnection();

        try {
            const game: GameResult[] =
            await databaseService.query<GameResult[]>(connection, "SELECT * FROM game WHERE SKU = ?", SKU);

            return game[0] ?? null;
        }
        finally {
            connection.release();
        }
    };
}
