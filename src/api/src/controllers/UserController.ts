import { Request, Response } from "express";
import { LoginData, UserEditData, UserRegisterData, UserResult } from "@shared/types";
import { UserService } from "../services/UserService";
import { SessionService } from "@api/services/SessionService";

interface UserRegisterRequest extends Request {
    body: UserRegisterData;
}

interface UserLoginRequest extends Request {
    body: LoginData;
}

interface LogoutRequest extends Request {
    body: { sessionId: string };
}

interface ChangeEmailBody {
    userId: number;
    email: string;
}

export class UserController {
    private readonly _userService: UserService = new UserService();
    private readonly _sessionService: SessionService = new SessionService();

    public async getData(_req: Request, res: Response): Promise<void> {
        try {
            const users: UserResult[] = await this._userService.getAllUsers();
            res.status(200).json(users);
        }
        catch (e: unknown) {
            res.status(500).json({ error: "Failed to fetch users", details: e instanceof Error ? e.message : "Unknown error" });
        }
    }

    public async loginUser(req: UserLoginRequest, res: Response): Promise<void> {
        const { email, password }: LoginData = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Email en wachtwoord zijn verplicht." });
            return;
        }

        try {
            const user: UserResult | undefined = await this._userService.findUserByEmail(email);

            if (!user || password !== user.password) {
                res.status(401).json({ error: "Ongeldige inloggegevens." });
                return;
            }
            // ✅ Create a new session
            const sessionId: string | undefined = await this._sessionService.createSession(user.userId); // you need this method

            // ✅ Set it as cookie or return in header
            res.cookie("session", sessionId, { httpOnly: true, secure: false }); // adjust for production
            res.status(200).json({ message: "Login succesvol." });
        }
        catch (error: unknown) {
            console.error("Login fout:", error);
            res.status(500).json({ error: "Interne serverfout bij inloggen." });
        }
    }

    public async logoutUser(req: LogoutRequest, res: Response): Promise<void> {
        const { sessionId } = req.body;
        if (!sessionId) {
            res.status(400).json({ message: "Geen sessionId meegegeven" });
            return;
        }
        try {
            const result: boolean = await this._sessionService.deleteSession(sessionId);
            if (!result) {
                res.status(404).json({ message: "Sessie niet gevonden" });
                return;
            }

            res.status(204).end();
        }
        catch (e) {
            console.error("Fout bij het verwijderen van sessie:", e);
            res.status(500).json({ message: "Er is een interne fout opgetreden bij het verwijderen van de sessie." });
        }
    }

    public async getUserByEmail(req: Request, res: Response): Promise<void> {
        const email: string = req.query.email as string;

        if (!email) {
            res.status(400).json({ error: "Emailadres ontbreekt" });
            return;
        }

        try {
            const user: UserResult | undefined = await this._userService.findUserByEmail(email);
            res.status(200).json(user);
        }
        catch (e: unknown) {
            res.status(500).json({ error: "Failed to fetch user", details: e instanceof Error ? e.message : "Unknown error" });
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

    /**
     * Edit the user information with the userService
     *
     * @param req Request with UserEditData of the user as the body
     * @param res Response to send the status to
     */
    public async editUser(req: Request<unknown, unknown, UserEditData>, res: Response): Promise<void> {
        // const { userId, fname, lname, dob, gender, country }: UserEditData = req.body as UserEditData;
        const body: UserEditData = req.body;

        try {
            if (
                typeof body.userId === "number" &&
                typeof body.fname === "string" &&
                typeof body.lname === "string" &&
                typeof body.dob === "string" &&
                typeof body.gender === "string" &&
                typeof body.country === "string"
            ) {
                await this._userService.editUser(
                    body.userId, body.fname, body.lname, body.dob, body.gender, body.country);

                // Gebruiker succesvol geregistreerd, geef een 201 status terug
                res.status(200).json({ message: "Gebruiker succesvol geregistreerd!" });
            }
            else {
                // Als het niet gelukt is, stuur een foutmelding terug
                res.status(500).json({ error: "Er is iets misgegaan bij het bewerken van de gebruiker." });
            }
        }
        catch (error: unknown) {
            console.error("Bewerking mislukt:", error);
            res.status(500).json({
                error: "Fout bij het bewerken van de gebruiker.",
                details: error instanceof Error ? error.message : error,
            });
        }
    }

    /**
     * Change the email with the UserService
     * @param req Request with ChangeEmailBody as the body
     * @param res Response to send the status to
     * @returns Boolean whether user is found and email is changed
     */
    public async changeEmail(req: Request<object, object, ChangeEmailBody>, res: Response): Promise<boolean> {
        const userService: UserService = new UserService();
        const { userId, email } = req.body;

        if (!userId || !email) {
            res.status(400).json({ error: "Missing userID or email" });
            return false;
        }

        try {
            const result: boolean = await userService.changeEmail(userId.toString(), email);

            if (!result) {
                res.status(404).json({ error: "User not found or update failed" });
                return false;
            }

            await userService.deleteTokenByEmail(email);

            res.sendStatus(200);
            return true;
        }
        catch (err) {
            console.error("Error updating email:", err);
            res.status(500).json({ error: "Internal server error" });
            return false;
        }
    }

    /**
     * Change the email with the UserService
     * @param req Request with ChangeEmailBody as the body
     * @param res Response to send the status to
     * @returns Boolean whether user is found and email is changed
     */
    public async cancelEmail(req: Request<object, object, ChangeEmailBody>, res: Response): Promise<boolean> {
        const userService: UserService = new UserService();
        const { userId, email } = req.body;

        if (!userId || !email) {
            res.status(400).json({ error: "Missing userID or email" });
            return false;
        }

        try {
            const result: boolean = await userService.changeEmail(userId.toString(), email);

            if (!result) {
                res.status(404).json({ error: "User not found or update failed" });
                return false;
            }

            await userService.deleteTokenByUserId(userId.toString());

            res.sendStatus(200);
            return true;
        }
        catch (err) {
            console.error("Error updating email:", err);
            res.status(500).json({ error: "Internal server error" });
            return false;
        }
    }
}
