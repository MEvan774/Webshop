import { GameResult } from "@shared/types";

/**
 * Interface for the ProfileGamesService
 */
export interface IProfileGamesService {
    createGamesHTML(userId: number): Promise<string>;
    getLicensesByUserId(userId: number): Promise<GameResult[] | undefined>;
    getGamesBySKU(SKU: string): Promise<GameResult | undefined>;
}
