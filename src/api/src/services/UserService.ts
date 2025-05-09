import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { UserResult } from "@shared/types";

/**
 * This service interacts with the database
 */
export class UserService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async findUserById(userId: number): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: UserResult[] = await this._databaseService.query<UserResult[]>(connection, "SELECT email, password FROM user WHERE userId = ?", userId);
            if (result.length > 0) {
                return true; // User exists
            }
            else {
                return false; // User does not exist
            }
        }
        catch (e: unknown) {
            throw new Error(`Error locating user: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async findUserByEmail(email: string): Promise<UserResult | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: UserResult[] = await this._databaseService.query<UserResult[]>(connection, "SELECT userId, email, password FROM user WHERE email = ?", email);
            if (result.length > 0) {
                return result[0];
            }
            else {
                return undefined;
            }
        }
        catch (e: unknown) {
            throw new Error(`Error locating user: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async getAllUsers(): Promise<UserResult[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: UserResult[] = await this._databaseService.query<UserResult[]>(connection, "SELECT * FROM user");
            return result;
        }
        catch (e: unknown) {
            throw new Error(`Failed to fetch users: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async registerUser(fname: string, lname: string, email: string, dob: string, gender: string, password: string): Promise<string | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection, "INSERT INTO user (email, firstname, lastname, password, dob, gender) VALUES (?, ?, ?, ?, ?, ?)", email, fname, lname, password, dob, gender
            );

            if (result.affectedRows > 0) {
                return result.insertId.toString();
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

    public async getUserById(userId: number): Promise<UserResult | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: UserResult[] = await this._databaseService.query<UserResult[]>(
                connection, "SELECT * FROM user WHERE userId = ?", userId);
            if (result.length > 0) {
                return result[0];
            }
            else {
                return undefined;
            }
        }
        catch (e: unknown) {
            throw new Error(`Error locating user: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async changePassword(userId: string, password: string): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            // Use parameterized query to prevent SQL injection
            const result: ResultSetHeader = await this._databaseService.query(connection,
                "UPDATE user SET password = ? WHERE userId = ?",
                password, userId
            );

            return result.affectedRows > 0;
        }
        catch (e: unknown) {
            throw new Error(`Error changing password: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async checkEmail(email: string): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: UserResult[] = await this._databaseService.query<UserResult[]>(
                connection, "SELECT * FROM user WHERE email = ?", email);
            if (result.length > 0) {
                return false;
            }
            else {
                return true;
            }
        }
        finally {
            connection.release();
        }
    }

    public async editUser(userId: number, fname: string, lname: string, dob: string, gender: string, country: string): Promise<string | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection,
                `UPDATE \`user\`
                    SET
                        firstname = ?,
                        lastname = ?,
                        dob = ?,
                        gender = ?,
                        country = ?
                    WHERE userId = ?;`,
                [fname, lname, dob, gender, country, userId]
            );

            if (result.affectedRows > 0) {
                return "succes";
            }
            else {
                throw new Error("Failed to update user, no rows affected.");
            }
        }
        catch (e: unknown) {
            throw new Error(`Failed to edit user: ${e instanceof Error ? e.message : "Unknown error"}`);
        }
        finally {
            connection.release();
        }
    }

    public async changeEmail(userId: string, email: string): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            // Use parameterized query to prevent SQL injection
            const result: ResultSetHeader = await this._databaseService.query(connection,
                "UPDATE user SET email = ? WHERE userId = ?",
                email, userId
            );

            return result.affectedRows > 0;
        }
        catch (e: unknown) {
            throw new Error(`Error changing email: ${e}`);
        }
        finally {
            connection.release();
        }
    }
}
