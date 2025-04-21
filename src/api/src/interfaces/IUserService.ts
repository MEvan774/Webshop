@Interface
export abstract class IUserService {
    public abstract getUserByEmail(email: string): Promise<boolean>;
    public abstract registerUser(fname: string, lname: string, email: string, dob: string, gender: string, password: string, passwordRepeat: string): Promise<void>;
}
