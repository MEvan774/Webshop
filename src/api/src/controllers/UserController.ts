import { Request, Response } from "express";
import { UserEditData, UserResult } from "@shared/types";
import { UserService } from "../services/UserService";
import { SessionService } from "@api/services/SessionService";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

/**
 * Request body shape for user registration
 */
interface RegisterBody {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    dob: string;
    gender: string;
}

/**
 * Request body shape for user login
 */
interface LoginBody {
    email: string;
    password: string;
}

interface UserRegisterRequest extends Request {
    body: RegisterBody;
}

interface UserLoginRequest extends Request {
    body: LoginBody;
}

interface LogoutRequest extends Request {
    body: { sessionId: string };
}

/**
 * Cookie options for the session cookie.
 * sameSite: "none" + secure: true is REQUIRED because the frontend (Vercel)
 * and API (Railway) are on different domains. Without this, the browser
 * silently rejects the cookie on cross-origin requests.
 */
const SESSION_COOKIE_OPTIONS: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "none";
} = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
};

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
        const { email, password }: LoginBody = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Email en wachtwoord zijn verplicht." });
            return;
        }

        try {
            const user: UserResult | undefined = await this._userService.findUserByEmail(email);

            if (!user) {
                res.status(401).json({ error: "Ongeldige inloggegevens." });
                return;
            }

            const matchPassword: boolean = await bcrypt.compare(password, user.password);
            if (!matchPassword) {
                res.status(401).json({ error: "Ongeldige inloggegevens." });
                return;
            }

            // No verification check — log in immediately
            const sessionId: string | undefined = await this._sessionService.createSession(user.userId);
            res.cookie("session", sessionId, SESSION_COOKIE_OPTIONS);
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
        catch (e: unknown) {
            console.error("Fout bij het verwijderen van sessie:", e);
            res.status(500).json({ message: "Er is een interne fout opgetreden bij het verwijderen van de sessie." });
        }
    }

    public async getUserByEmail(req: Request, res: Response): Promise<void> {
        const { email } = req.params;

        if (!email) {
            res.status(400).json({ error: "Emailadres ontbreekt" });
            console.log("no email found");
            return;
        }

        try {
            const user: UserResult | undefined = await this._userService.findUserByEmail(email);
            if (!user) {
                res.status(404).json({ error: "Gebruiker niet gevonden" });
                return;
            }

            res.status(200).json(user);
        }
        catch (e: unknown) {
            res.status(500).json({ error: "Failed to fetch user", details: e instanceof Error ? e.message : "Unknown error" });
        }
    }

    public async registerUser(req: UserRegisterRequest, res: Response): Promise<void> {
        const { firstname, lastname, email, dob, gender, password }: RegisterBody = req.body;
        const hashedPassword: string = await bcrypt.hash(password, 10);
        const verificationToken: string = randomBytes(32).toString("hex");

        try {
            const userId: string | undefined = await this._userService.registerUser(
                firstname, lastname, email, dob, gender, hashedPassword, verificationToken
            );

            if (userId) {
                // Create session immediately — no verification needed
                const sessionId: string | undefined = await this._sessionService.createSession(Number(userId));
                res.cookie("session", sessionId, SESSION_COOKIE_OPTIONS);

                res.status(201).json({
                    message: "Gebruiker succesvol geregistreerd!",
                    userId,
                });
            }
            else {
                res.status(500).json({ error: "Er is iets misgegaan bij het registreren van de gebruiker." });
            }
        }
        catch (error: unknown) {
            console.error("Registratie mislukt:", error);
            res.status(500).json({
                error: "Fout bij het registreren van de gebruiker.",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    /**
     * Edit the user information with the userService
     */
    public async editUser(req: Request<unknown, unknown, UserEditData>, res: Response): Promise<void> {
        console.log("Incoming request body:", req.body);
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

                res.status(200).json({ message: "Gebruiker succesvol geregistreerd!" });
            }
            else {
                res.status(500).json({ error: "Er is iets misgegaan bij het bewerken van de gebruiker." });
            }
        }
        catch (error: unknown) {
            console.error("Bewerking mislukt:", error);
            res.status(500).json({
                error: "Fout bij het bewerken van de gebruiker.",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
