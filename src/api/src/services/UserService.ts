import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { UserResult } from "@shared/types";

export class UserService {
    // private _userId: number;
    // private _email: string;
    // private _password: string;
    // private _firstname: string;
    // private _lastname: string;
    // private _dob: string;
    // private _gender: string;
    private readonly _databaseService: DatabaseService = new DatabaseService();

    // public constructor(userId: number, email: string, password: string, firstname: string, lastname: string, dob: string, gender: string) {
    //     this._userId = userId;
    //     this._email = email;
    //     this._password = password;
    //     this._firstname = firstname;
    //     this._lastname = lastname;
    //     this._dob = dob;
    //     this._gender = gender;
    // }

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

    public async registerUser(
        fname: string,
        lname: string,
        email: string,
        dob: string,
        gender: string,
        password: string
    ): Promise<string | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection, "INSERT INTO user (email, firstname, lastname, password, dob, gender) VALUES (?, ?, ?, ?, ?, ?)", email, fname, lname, password, dob, gender
            );

            // Controleer of de rij is ingevoegd en retourneer het ID van de nieuw gemaakte gebruiker
            if (result.affectedRows > 0) {
                return result.insertId.toString(); // Retourneer het userId
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
