import { Request, Response } from "express";
import { LoginData, UserRegisterData, UserResult } from "@shared/types";
import { UserService } from "../services/UserService";
import { SessionService } from "@api/services/SessionService";
import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";

interface UserRegisterRequest extends Request {
    body: UserRegisterData;
}

interface UserLoginRequest extends Request {
    body: LoginData;
}

interface LogoutRequest extends Request {
    body: { sessionId: string };
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

            const matchPassword: boolean = await bcrypt.compare(password, user.password);
            if (!matchPassword) {
                res.status(401).json({ error: "Ongeldige inloggegevens." });
                return;
            }

            const sessionId: string | undefined = await this._sessionService.createSession(user.userId);
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

    /**
     * This function calls on the database to find a user based off the email
     * @param req This function has to have a request
     * @param res This function has to have a response
     * @returns void
     */
    public async getUserByEmail(req: Request, res: Response): Promise<void> {
        const email: string = req.query.email as string;

        if (!email) {
            res.status(400).json({ error: "Emailadres ontbreekt" });
            return;
        }

        try {
            const user: UserResult | undefined = await this._userService.findUserByEmail(email);

            if (!user) {
                res.status(404).json({ error: "Gebruiker niet gevonden" }); // ← duidelijke status
                return;
            }

            res.status(200).json(user); // alleen als user er is
        }
        catch (e: unknown) {
            res.status(500).json({ error: "Failed to fetch user", details: e instanceof Error ? e.message : "Unknown error" });
        }
    }

    /**
     * This function calls on the database to insert the new user
     * @param req This function has to have a request
     * @param res This function has to have a response
     */
    public async registerUser(req: UserRegisterRequest, res: Response): Promise<void> {
        const { firstname, lastname, email, dob, gender, password }: UserRegisterData = req.body;
        const salt: string = randomBytes(16).toString("hex");
        const hashedPassword: string = createHash("sha256").update(password + salt).digest("hex");

        try {
            const userId: string | undefined = await this._userService.registerUser(firstname, lastname, email, dob, gender, hashedPassword);

            if (userId) {
                res.status(201).json({ message: "Gebruiker succesvol geregistreerd!", userId });
            }
            else {
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
