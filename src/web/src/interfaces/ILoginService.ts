export abstract class ILoginService {
    public abstract checkData(email: string, password: string): { valid: boolean; message?: string };
    public abstract loginUser(email: string, password: string): Promise<void>;
}
