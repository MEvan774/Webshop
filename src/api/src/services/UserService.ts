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
            const result: UserResult[] = await this._databaseService.query<UserResult[]>(connection, "SELECT userId, email, password, isVerified FROM user WHERE email = ?", email);
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

    /**
     * Get the user from the database by the userId
     *
     * @param userId Id of the user to be found as number
     * @returns User as UserResult or undefined if no user is found
     */
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

    /**
     * Change the password of the user
     *
     * @param userId UserId of the user as string
     * @param password The new password as string
     * @returns Boolean whether the password is succesfully changed
     */
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

    /**
     * Check if the email is in use when changing the email
     *
     * @param email The email that gets checked as string
     * @returns Boolean if email is in use
     */
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

    /**
     * Change the information of the user in the database
     *
     * @param userId UserId of the user as number
     * @param fname New or unchanged first name of the user as string
     * @param lname New or unchanged last name of the user as string
     * @param dob New or unchanged date of birth of the user as string
     * @param gender New or unchanged gender of the user as string
     * @param country New or unchanged country of the user as string
     * @returns String with error message or 'succes'
     */
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

    /**
     * Change the email of the user after the confirmation email
     *
     * @param userId UserId of the user as string
     * @param email New email as string
     * @returns Boolean whether the change was succesful
     */
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

    /**
     * Delete the tokens by userId
     *
     * @param userId UserId of the user as string
     * @returns Boolean whether the change was succesful
     */
    public async deleteTokenByUserId(userId: string): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            // Use parameterized query to prevent SQL injection
            const result: ResultSetHeader = await this._databaseService.query(connection,
                "DELETE FROM token WHERE userId = ?",
                userId
            );

            return result.affectedRows > 0;
        }
        catch (e: unknown) {
            throw new Error(`Error deleting token: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    /**
     * Delete the tokens by email
     *
     * @param userId UserId of the user as string
     * @returns Boolean whether the change was succesful
     */
    public async deleteTokenByEmail(email: string): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            // Use parameterized query to prevent SQL injection
            const result: ResultSetHeader = await this._databaseService.query(connection,
                "DELETE FROM token WHERE email = ?",
                email
            );

            return result.affectedRows > 0;
        }
        catch (e: unknown) {
            throw new Error(`Error deleting token: ${e}`);
        }
        finally {
            connection.release();
        }
    }
}
