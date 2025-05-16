import { UserResult } from "@shared/types";

export interface IProfileChangePasswordService {
    passwordSave(user: UserResult, shadowRoot: ShadowRoot): Promise<boolean>;
    changePassword(userID: number, newPassword: string): Promise<boolean>;
}
