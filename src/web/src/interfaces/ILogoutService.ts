export abstract class ILogoutService {
    public abstract logoutUser(sessionId: string): Promise<void>;
}
