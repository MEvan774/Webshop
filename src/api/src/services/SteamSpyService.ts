/**
 * Raw response shape from the SteamSpy appdetails endpoint.
 */
export type SteamSpyAppDetails = {
    appid: number;
    name: string;
    developer: string;
    publisher: string;
    score_rank: string;
    positive: number;
    negative: number;
    userscore: number;
    owners: string;
    average_forever: number;
    average_2weeks: number;
    median_forever: number;
    median_2weeks: number;
    price: string;
    initialprice: string;
    discount: string;
    languages: string;
    genre: string;
    ccu: number;
    tags: Record<string, number>;
};

const STEAMSPY_BASE: string = "https://steamspy.com/api.php";

/**
 * Service for fetching game data from the SteamSpy API.
 * No API key required. Rate-limited (be gentle with requests).
 */
export class SteamSpyService {
    /**
     * Fetch details for a single app from SteamSpy.
     *
     * @param appId The Steam App ID
     * @returns SteamSpy app details
     */
    public async getAppDetails(appId: string): Promise<SteamSpyAppDetails> {
        const response: Response = await fetch(
            `${STEAMSPY_BASE}?request=appdetails&appid=${encodeURIComponent(appId)}`
        );

        if (!response.ok) {
            throw new Error(`SteamSpy API error: ${response.status} ${response.statusText}`);
        }

        const data: SteamSpyAppDetails = await response.json() as SteamSpyAppDetails;
        return data;
    }

    /**
     * Fetch the top 100 most-owned games.
     *
     * @returns Array of SteamSpy app summaries
     */
    public async getTop100Owned(): Promise<Record<string, SteamSpyAppDetails>> {
        const response: Response = await fetch(`${STEAMSPY_BASE}?request=top100owned`);

        if (!response.ok) {
            throw new Error(`SteamSpy API error: ${response.status} ${response.statusText}`);
        }

        const data: Record<string, SteamSpyAppDetails> =
            await response.json() as Record<string, SteamSpyAppDetails>;

        return data;
    }

    /**
     * Fetch the top 100 games by current players in the last 2 weeks.
     *
     * @returns Record of appid -> app details
     */
    public async getTop100In2Weeks(): Promise<Record<string, SteamSpyAppDetails>> {
        const response: Response = await fetch(`${STEAMSPY_BASE}?request=top100in2weeks`);

        if (!response.ok) {
            throw new Error(`SteamSpy API error: ${response.status} ${response.statusText}`);
        }

        const data: Record<string, SteamSpyAppDetails> =
            await response.json() as Record<string, SteamSpyAppDetails>;

        return data;
    }

    /**
     * Fetch games by genre.
     *
     * @param genre Genre name (e.g. "Action", "RPG", "Early Access")
     * @returns Record of appid -> app details
     */
    public async getGamesByGenre(genre: string): Promise<Record<string, SteamSpyAppDetails>> {
        const response: Response = await fetch(
            `${STEAMSPY_BASE}?request=genre&genre=${encodeURIComponent(genre)}`
        );

        if (!response.ok) {
            throw new Error(`SteamSpy API error: ${response.status} ${response.statusText}`);
        }

        const data: Record<string, SteamSpyAppDetails> =
            await response.json() as Record<string, SteamSpyAppDetails>;

        return data;
    }

    /**
     * Fetch games by tag.
     *
     * @param tag Tag name (e.g. "Indie", "Multiplayer")
     * @returns Record of appid -> app details
     */
    public async getGamesByTag(tag: string): Promise<Record<string, SteamSpyAppDetails>> {
        const response: Response = await fetch(
            `${STEAMSPY_BASE}?request=tag&tag=${encodeURIComponent(tag)}`
        );

        if (!response.ok) {
            throw new Error(`SteamSpy API error: ${response.status} ${response.statusText}`);
        }

        const data: Record<string, SteamSpyAppDetails> =
            await response.json() as Record<string, SteamSpyAppDetails>;

        return data;
    }

    /**
     * Derive a Steam-style rating text from positive / negative review counts.
     *
     * @param positive Number of positive reviews
     * @param negative Number of negative reviews
     * @returns Human-readable rating label (e.g. "Very Positive")
     */
    public static deriveRatingText(positive: number, negative: number): string {
        const total: number = positive + negative;

        if (total === 0) {
            return "No Reviews";
        }

        const percent: number = (positive / total) * 100;

        if (total < 10) {
            return "Not Enough Reviews";
        }

        if (percent >= 95) return "Overwhelmingly Positive";
        if (percent >= 80 && total >= 500) return "Very Positive";
        if (percent >= 80) return "Positive";
        if (percent >= 70) return "Mostly Positive";
        if (percent >= 40) return "Mixed";
        if (percent >= 20 && total >= 500) return "Mostly Negative";
        if (percent >= 20) return "Negative";
        if (total >= 500) return "Very Negative";
        return "Overwhelmingly Negative";
    }
}
