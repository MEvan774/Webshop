import { UserResult } from "@shared/types";

export interface IProfileService {
    getUser(): Promise<UserResult | null>;
    formatDate(dateString: string): string;
    getGender(gender: string): string;
}
