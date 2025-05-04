import { UserResult } from "@shared/types";
import { SessionService } from "./SessionService";
import { UserService } from "./UserService";

export async function getUser(sessionID: string): Promise<UserResult | undefined> {
    const sessionService: SessionService = new SessionService();
    const userService: UserService = new UserService();

    const currentUserId: number | undefined = await sessionService.getUserIdBySession(sessionID);

    if (!currentUserId) {
        return;
    }

    const currentUser: UserResult | undefined = await userService.getUserById(currentUserId);

    if (currentUser) {
        console.log(currentUser);
        return currentUser;
    }

    return;
}
