import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { UserRegistrationResponse, UserResult } from "@shared/types";

/**
 * This service interacts with the database
 */
export class UserService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    /**
     * To determine if the user exists
     * @param userId Finds the user based off the ID
     * @returns True or false (does the user exist)
     */
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

    /**
     * To determine if a user has registered already, using it's email
     * @param email Finds the user based off the email
     * @returns All records of the user
     */
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

    public async registerUser(fname: string, lname: string, email: string, dob: string, gender: string, password: string, verifyToken: string): Promise<string | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection, "INSERT INTO user (email, firstname, lastname, password, dob, gender, verificationToken, isVerified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", email, fname, lname, password, dob, gender, verifyToken, false
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

    public async verifyUser(verificationToken: string): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: UserRegistrationResponse[] = await this._databaseService.query<UserRegistrationResponse[]>(connection, "SELECT userId, isVerified FROM user WHERE verificationToken = ?", verificationToken);
            if (result.length > 0) {
                const user: UserRegistrationResponse = result[0];
                if (user.isVerified) {
                    throw new Error("Uw account is reeds geverifieerd.");
                }

                await this._databaseService.query(connection, "UPDATE user SET isVerified = true WHERE userId = ?", user.userId);
                return true;
            }
            else {
                throw new Error("Geen gebruiker met dit verificatietoken gevonden.");
            }
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Fout bij verificatie:", error.message);
            }
            else {
                console.error("Onbekende fout bij verificatie:", error);
            }
            throw error; // Hergooi de fout zodat deze afgehandeld kan worden in de route
        }
        finally {
            connection.release();
        }
    }
}
