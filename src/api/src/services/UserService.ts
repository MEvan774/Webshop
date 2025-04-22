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
            const result: UserResult[] = await this._databaseService.query<UserResult[]>(
                connection, "SELECT * FROM user WHERE email = ? LIMIT 1", email
            );
            return result.length > 0;
        }
        catch (e: unknown) {
            throw new Error(`Failed to locate user: ${e instanceof Error ? e.message : "Unknown error"}`);
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
}
