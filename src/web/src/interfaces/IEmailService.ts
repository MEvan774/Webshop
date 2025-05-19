export abstract class IEmailService {
    public abstract sendEmail(name: string, email: string, subject: string, htmlBody: string): Promise<void>;
}
