export abstract class IRegisterService {
    // public abstract createAccount(): Promise<string | undefined>;
    // public abstract getUserById(userId: number): Promise<number | undefined>;
    public abstract testQuery(): Promise<number | undefined>;
    public abstract onClickRegister(fname: string, lname: string, email: string, dob: string, gender: string, password: string, passwordRepeat: string): Promise<boolean>;
}
