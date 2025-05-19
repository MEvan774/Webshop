import { UserResult } from "@shared/types";
import { EmailService } from "@web/services/EmailService";

/**
 * Interface for the ProfileChangeEmailService
 */
export interface IProfileChangeEmailService {
    _emailService: EmailService;
    emailSave(user: UserResult, shadowRoot: ShadowRoot): Promise<boolean>;
    writeEmail(kind: string, name: string, email: string, userId: number, newEmail?: string): Promise<boolean>;
    getToken(): string;
    saveToken(token: string, userId: number, email: string, type: string): Promise<void>;
}
