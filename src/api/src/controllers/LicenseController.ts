import { LicenseService } from "@api/services/LicenseService";
import { LicenseResult } from "@shared/types";
import { Response } from "express";

/**
 * Class for the licenses controller
 */
export class LicenseController {
    private readonly licenseService: LicenseService = new LicenseService();

    /**
     * Get the licenses of the user by userId
     *
     * @param userId The userId of the user as string
     * @param res The response to send the result to
     */
    public async getLicensesByUser(userId: string, res: Response): Promise<void> {
        try {
            // Call the service function to get the license data
            const licenses: LicenseResult[] | undefined = await this.licenseService.getLicenses(userId);

            if (!licenses) {
                res.status(404).json({ error: "No games are found" });
            }

            res.status(200).json(licenses);
        }
        catch (error) {
            console.error("License not found:", error);
            res.status(500).json({ error: "An error occurred while getting the licenses." });
        }
    }
}
