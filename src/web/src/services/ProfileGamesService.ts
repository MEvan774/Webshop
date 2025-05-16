import { GameResult, LicenseResult } from "@shared/types";
import { IProfileGamesService } from "@web/interfaces/IProfileGamesService";

export class ProfileGamesService implements IProfileGamesService {
    /**
     * Creates the HTML for the owned games of the user
     *
     * @param userId The userId of the user as number
     * @returns String with the HTML for the games
     */
    public async createGamesHTML(userId: number): Promise<string> {
        let html: string = "<h2>Geen spellen gevonden. Koop een spel om hier uw spellen te zien!</h2>";
        const games: GameResult[] | undefined = await this.getLicensesByUserId(userId);

        if (!games) {
            return html;
        }
        else {
            html = "";
        }

        for (let x: number = 0; x < games.length; x++) {
            html += `
            <div id='game${x}' class='gameProfileClass'>
                <img src='${games[x].thumbnail}' class='gameProfileThumbnail'>
                <div class='gameProfileText'>
                    <p class='gameProfileTitle'>${games[x].title}</p>
                    <a class='gamesProfileButton' href='${games[x].url}' target="_blank" rel="noopener">Speel nu!</a>
                </div>
            </div>
            `;
        }

        return html;
    }

    /**
     * Gets the licenses of the games the user owns
     *
     * @param userId The userId of the user as number
     * @returns GameResult[] with owned games, or undefined if no games are owned
     */
    public async getLicensesByUserId(userId: number): Promise<GameResult[] | undefined> {
        const response: Response = await fetch(`http://localhost:3001/license/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            return;
        }

        const licenseData: LicenseResult[] = await response.json() as LicenseResult[];

        const games: GameResult[] = [];

        for (let x: number = 0; x < licenseData.length; x++) {
            const gameFound: GameResult | undefined = await this.getGamesBySKU(licenseData[x].SKU);

            if (gameFound) {
                games.push(gameFound);
            }
        }

        return games;
    }

    /**
     * Gets the game with the SKU
     *
     * @param SKU The SKU of the game as string
     * @returns GameResult with the game, or undefined if no game is found
     */
    public async getGamesBySKU(SKU: string): Promise<GameResult | undefined> {
        const response: Response = await fetch(`http://localhost:3001/gamesSKU/${SKU}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            console.error(`Error fetching game with ID ${SKU}:`, response.statusText);
            return;
        }

        const gamesData: GameResult = await response.json() as GameResult;

        return gamesData;
    }
}
