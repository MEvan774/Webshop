import { UserResult } from "@shared/types";

/**
 * Interface for the ProfileChangePasswordService
 */
export interface IProfileChangePasswordService {
    passwordSave(user: UserResult, shadowRoot: ShadowRoot): Promise<boolean>;
    changePassword(userID: number, newPassword: string): Promise<boolean>;
}
