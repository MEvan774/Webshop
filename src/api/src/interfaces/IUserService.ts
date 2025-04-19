@Interface
export abstract class IUserService {
    // public abstract createAccount(): Promise<string | undefined>;
    // public abstract getUserById(userId: number): Promise<number | undefined>;
    public abstract registerUser(fname: string, lname: string, email: string, dob: string, gender: string, password: string, passwordRepeat: string): Promise<void>;
}
