import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { TokenData } from "@shared/types";

/**
 * Class for the token
 */
export class TokenService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    /**
     * Save a token in the database
     *
     * @param userId UserId linked to the token as number
     * @param token Token as string
     * @param email Email linked to the token as string
     * @returns Boolean whether saving the token was succesful
     */
    public async createToken(userId: number, token: string, email: string, type: string): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection, "INSERT INTO token (token, userId, email, type) VALUES (?, ?, ?, ?)", token, userId, email, type
            );

            if (result.affectedRows > 0) {
                return true;
            }
            else {
                throw new Error("Failed to register user, no rows affected.");
            }
        }
        catch (e: unknown) {
            throw new Error(`Failed to register user: ${e instanceof Error ? e.message : "Unknown error"}`);
        }
        finally {
            connection.release();
        }
    }

    /**
     * Checks if the token exists
     *
     * @param token Token to check as string
     * @returns The token as TokenData, or undefined if no token is found
     */
    public async checkToken(token: string): Promise<TokenData | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: TokenData[] = await this._databaseService.query<TokenData[]>(connection, "SELECT * FROM token WHERE token = ?", [token]);
            return result[0];
        }
        catch (e: unknown) {
            throw new Error(`Token is invalid: ${e instanceof Error ? e.message : "Unknown error"}`);
        }
        finally {
            connection.release();
        }
    }
}
