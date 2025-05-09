import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { TokenData } from "@shared/types";

export class TokenService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async createToken(userId: number, token: string, email: string): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection, "INSERT INTO token (token, userId, email) VALUES (?, ?, ?)", token, userId, email
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

    public async checkToken(token: string): Promise<number | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: TokenData[] = await this._databaseService.query<TokenData[]>(connection, "SELECT * FROM token WHERE token = ?", [token]);
            if (result.length > 0) {
                return result[0].userId;
            }
            else {
                return;
            }
        }
        catch (e: unknown) {
            throw new Error(`Token is invalid: ${e instanceof Error ? e.message : "Unknown error"}`);
        }
        finally {
            connection.release();
        }
    }
}
