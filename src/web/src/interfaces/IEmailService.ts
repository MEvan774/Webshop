export abstract class IEmailService {
    public abstract sendVerifyEmail(name: string, email: string, subject: string, htmlBody: string): Promise<void>;
    public abstract isEmailUsed(email: string): Promise<boolean>;
}
