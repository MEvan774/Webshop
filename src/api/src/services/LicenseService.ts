import { LicenseResult } from "@shared/types";
import { DatabaseService } from "./DatabaseService";
import { PoolConnection } from "mysql2/promise";

/**
 * Class for the licenses
 */
export class LicenseService {
    /**
     * Get the licenses with the userId
     *
     * @param userId The userId of the user as string
     * @returns LicenseResult[] with all the licenses, or undefined if no licenses are found
     */
    public async getLicenses(userId: string): Promise<LicenseResult[] | undefined> {
        const databaseService: DatabaseService = new DatabaseService();
        const connection: PoolConnection = await databaseService.openConnection();

        try {
            const allLicenses: LicenseResult[] = await databaseService.query<LicenseResult[]>(
                connection, "SELECT * FROM license WHERE userId = ?", userId);

            if (allLicenses[0]) {
                return allLicenses;
            }
            else {
                return;
            }
        }
        finally {
            connection.release();
        }
    }
}
