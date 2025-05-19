import { DatabaseService } from "@api/services/DatabaseService";
import { GameResult } from "@shared/types";
import { PoolConnection } from "mysql2/promise";

/**
 * Get the current game with the gameID
 *
 * @param gameID GameID of the game with string
 * @returns Game as GameResult or null if no game is found
 */
export async function getGameWithGameID(gameID: string): Promise<GameResult | null> {
    const databaseService: DatabaseService = new DatabaseService();
    const connection: PoolConnection = await databaseService.openConnection();

    try {
        const currentGame: GameResult[] =
          await databaseService.query<GameResult[]>(connection, "SELECT * FROM game WHERE gameID = ?", gameID);

        return currentGame[0] ?? null;
    }
    finally {
        connection.release();
    }
};
