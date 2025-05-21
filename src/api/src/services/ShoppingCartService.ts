import { IShoppingCartService } from "@api/interfaces/IShoppingCartService";
import { DatabaseService } from "./DatabaseService";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";

export class ShoppingCartService implements IShoppingCartService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async addToCart(gameId: number, userId: number): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(connection,
                "INSERT INTO cart (userId, gameId) VALUES (?, ?)", userId, gameId
            );

            if (result.affectedRows > 0) {
                return true;
            }
            else {
                throw new Error("Failed to add game to cart, no rows affected.");
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
        finally {
            connection.release();
        }
    }

    public async removeFromCart(gameId: number, userId: number): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: ResultSetHeader = await this._databaseService.query(connection,
                "DELETE FROM cart WHERE (userId, gameId) VALUES (?, ?)", userId, gameId
            );

            if (result.affectedRows > 0) {
                return true;
            }
            else {
                throw new Error("Removing game from cart failed");
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
        finally {
            connection.release();
        }
    }

    public async removeAllFromCart(userId: number): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: ResultSetHeader = await this._databaseService.query(connection,
                "DELETE FROM cart WHERE userId = ?", userId
            );

            if (result.affectedRows > 0) {
                return true;
            }
            else {
                throw new Error("Removing game from cart failed");
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
        finally {
            connection.release();
        }
    }
}
