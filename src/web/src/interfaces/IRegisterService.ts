/**
 * All functions are stored here
 */
export abstract class IRegisterService {
    public abstract checkData(fname: string, lname: string, email: string, dob: string, gender: string, password: string, passwordRepeat: string): { valid: boolean; message?: string };
    public abstract registerUser(fname: string, lname: string, email: string, dob: string, gender: string, password: string, passwordRepeat: string): Promise<boolean>;
    public abstract getUserByEmail(email: string): Promise<boolean>;
}
