import { Request, Response } from "express";
import { TokenService } from "@api/services/tokenService";
import { TokenData } from "@shared/types";

interface TokenDataRequest extends Request {
    body: TokenData;
}

export class TokenController {
    private readonly _tokenService: TokenService = new TokenService();

    public async createToken(req: TokenDataRequest, res: Response): Promise<void> {
        const { token, userId, email }: TokenData = req.body;

        try {
            // Roep de registerUser methode van de UserService aan
            const tokenSaved: boolean = await this._tokenService.createToken(userId, token, email);

            if (tokenSaved) {
                // Gebruiker succesvol geregistreerd, geef een 201 status terug
                res.status(201).json({ message: "Token is opgeslagen" });
            }
            else {
                // Als het niet gelukt is, stuur een foutmelding terug
                res.status(500).json({ error: "Er is iets misgegaan bij het opslaan van de token" });
            }
        }
        catch (error: unknown) {
            console.error("Token opslaan mislukt mislukt:", error);
            res.status(500).json({
                error: "Fout bij het registreren van de gebruiker.",
                details: error instanceof Error ? error.message : error,
            });
        }
    }

    public async checkToken(token: string): Promise<number | undefined> {
        const userId: number | undefined = await this._tokenService.checkToken(token);

        if (userId) {
            return userId;
        }
        else {
            return;
        }
    }
}
