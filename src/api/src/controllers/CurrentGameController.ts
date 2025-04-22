import { DatabaseService } from "@api/services/DatabaseService";
import { GameResult } from "@shared/types";
import { PoolConnection } from "mysql2/promise";

export async function getGameWithGameID(gameID: string): Promise<GameResult> {
    const databaseService: DatabaseService = new DatabaseService();
    const connection: PoolConnection = await databaseService.openConnection();

    const currentGame: GameResult = await databaseService.query<GameResult>(connection, "SELECT * FROM game WHERE gameID =" + gameID);

    return currentGame;
};
