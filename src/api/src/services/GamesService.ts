import { IGamesService } from "@api/interfaces/IGamesService";
import { GameResult } from "@shared/types";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";

export class GamesService implements IGamesService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async getAllGames(): Promise<GameResult[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            // Zorg ervoor dat je de juiste kolommen selecteert uit je database
            const result: GameResult[] = await this._databaseService.query<GameResult[]>(
                connection,
                `SELECT 
                    gameId, 
                    SKU, 
                    title, 
                    thumbnail, 
                    images, 
                    descriptionMarkdown, 
                    descriptionHtml, 
                    url, 
                    authors, 
                    tags, 
                    reviews
                FROM games`
            );
            return result;
        }
        catch (e: unknown) {
            throw new Error(`Failed to fetch games: ${e}`);
        }
        finally {
            connection.release();
        }
    }
}
