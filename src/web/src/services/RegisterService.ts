import { UserResult } from "@shared/types";
import { IRegisterService } from "@web/interfaces/IRegisterService";

export class RegisterService implements IRegisterService {
    // Haal alle gebruikers op
    public async getAllUsers(): Promise<UserResult[]> {
        const response: Response = await fetch(`${VITE_API_URL}user`, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const users: UserResult[] = await response.json() as unknown as UserResult[];
        return users;
    }

    public async testQuery(): Promise<number | undefined> {
        const response: Response = await fetch(`${VITE_API_URL}user`, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        const userResult: UserResult = await response.json() as unknown as UserResult;
        return userResult.userId;
    }
}
