import { GameResult } from "@shared/types";

export interface IProfileGamesService {
    createGamesHTML(userId: number): Promise<string>;
    getLicensesByUserId(userId: number): Promise<GameResult[] | undefined>;
    getGamesBySKU(SKU: string): Promise<GameResult | undefined>;
}
