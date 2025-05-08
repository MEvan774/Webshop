import { UserResult } from "@shared/types";
import { SessionService } from "./SessionService";
import { UserService } from "./UserService";
import { Request } from "express";
import { Response } from "express-serve-static-core";

interface ChangePasswordBody {
    userID: string;
    newPassword: string;
}

export async function getUser(sessionID: string): Promise<UserResult | undefined> {
    const sessionService: SessionService = new SessionService();
    const userService: UserService = new UserService();

    const currentUserId: number | undefined = await sessionService.getUserIdBySession(sessionID);

    if (!currentUserId) {
        return;
    }

    const currentUser: UserResult | undefined = await userService.getUserById(currentUserId);

    if (currentUser) {
        return currentUser;
    }

    return;
}

export async function changePassword(req: Request<object, object, ChangePasswordBody>, res: Response): Promise<boolean> {
    const userService: UserService = new UserService();
    const { userID, newPassword } = req.body;

    if (!userID || !newPassword) {
        res.status(400).json({ error: "Missing userID or newPassword" });
        return false;
    }

    const password: string = String(newPassword);

    try {
        const result: boolean = await userService.changePassword(userID, password);

        if (!result) {
            res.status(404).json({ error: "User not found or update failed" });
            return false;
        }

        res.sendStatus(200);
        return true;
    }
    catch (err) {
        console.error("Error updating password:", err);
        res.status(500).json({ error: "Internal server error" });
        return false;
    }
}

export async function checkEmail(email: string): Promise<boolean> {
    const userService: UserService = new UserService();

    const isEmailFree: boolean = await userService.checkEmail(email);

    if (isEmailFree) {
        return true;
    }

    return false;
}
