import { Request, Response } from "express";
import { UserService } from "@api/services/UserService";
import { UserResult } from "@shared/types";

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
}
