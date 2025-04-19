import { Request, Response } from "express";
import { UserService } from "@api/services/UserService";
import { UserRegisterData, UserResult } from "@shared/types";

interface UserRegisterRequest extends Request {
    body: UserRegisterData;
}

export class UserController {
    private readonly _userService: UserService = new UserService();

    public async getData(req: Request, res: Response): Promise<void> {
        try {
            const users: UserResult[] = await this._userService.getAllUsers();
            res.status(200).json(users);
        }
        catch (e: unknown) {
            res.status(500).json({ error: "Failed to fetch users", details: e instanceof Error ? e.message : "Unknown error" });
        }
    }

    public async registerUser(req: UserRegisterRequest, res: Response): Promise<void> {
        const { firstname, lastname, email, dob, gender, password }: UserRegisterData = req.body;

        try {
            // Roep de registerUser methode van de UserService aan
            const userId: string | undefined = await this._userService.registerUser(firstname, lastname, email, dob, gender, password);

            if (userId) {
                // Gebruiker succesvol geregistreerd, geef een 201 status terug
                res.status(201).json({ message: "Gebruiker succesvol geregistreerd!", userId });
            }
            else {
                // Als het niet gelukt is, stuur een foutmelding terug
                res.status(500).json({ error: "Er is iets misgegaan bij het registreren van de gebruiker." });
            }
        }
        catch (error: unknown) {
            console.error("Registratie mislukt:", error);
            res.status(500).json({
                error: "Fout bij het registreren van de gebruiker.",
                details: error instanceof Error ? error.message : error,
            });
        }
    }
}
