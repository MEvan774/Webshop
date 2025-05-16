import { UserResult } from "@shared/types";

/**
 * Interface for the ProfileEditService
 */
export interface IProfileEditService {
    getGenderSelect(user: UserResult): string;
    saveProfile(user: UserResult, shadowRoot: ShadowRoot): Promise<boolean>;
    saveEditProfile(
        userId: number, fname: string, lname: string, dob: string, gender: string, countryString?: string
    ): Promise<boolean>;
}
