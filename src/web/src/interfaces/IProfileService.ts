import { UserResult } from "@shared/types";

/**
 * Interface for the ProfileService
 */
export interface IProfileService {
    getUser(): Promise<UserResult | null>;
    formatDate(dateString: string): string;
    getGender(gender: string): string;
}
