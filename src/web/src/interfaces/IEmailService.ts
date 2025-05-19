export abstract class IEmailService {
    public abstract sendVerifyEmail(name: string, email: string, subject: string, htmlBody: string): Promise<void>;
    public abstract sendEmail(name: string, email: string, subject: string, htmlBody: string): Promise<void>;
}
