@Interface
export abstract class IUserService {
    // public abstract createAccount(): Promise<string | undefined>;
    // public abstract getUserById(userId: number): Promise<number | undefined>;
    public abstract testQuery(): Promise<boolean | undefined>;
}
