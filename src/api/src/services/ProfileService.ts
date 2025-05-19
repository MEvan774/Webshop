import { UserResult } from "@shared/types";
import { SessionService } from "./SessionService";
import { UserService } from "./UserService";
import { Request } from "express";
import { Response } from "express-serve-static-core";

interface ChangePasswordBody {
    userID: string;
    password: string;
}

/**
 * Get the user with the sessionID
 *
 * @param sessionID SessionID the user is linked to as string
 * @returns User as UserResult or undefined if no user is found
 */
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

/**
 * Change the password of the user with the UserService
 *
 * @param req Request with userID and newPassword in the body
 * @param res Response to send the status to
 * @returns Boolean whether change is succesful
 */
export async function changePassword(req: Request<object, object, ChangePasswordBody>, res: Response): Promise<boolean> {
    console.log(req.body);
    const userService: UserService = new UserService();
    const { userID, password } = req.body;

    if (!userID || !password) {
        res.status(400).json({ error: "Missing userID or newPassword" });
        return false;
    }

    const passwordString: string = String(password);

    try {
        const result: boolean = await userService.changePassword(userID, passwordString);

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

/**
 * Checks if the email is free with the userService
 *
 * @param email Email to get checked as string
 * @returns Boolean whether email is free
 */
export async function checkEmail(email: string): Promise<boolean> {
    const userService: UserService = new UserService();

    const isEmailFree: boolean = await userService.checkEmail(email);

    if (isEmailFree) {
        return true;
    }

    return false;
}
