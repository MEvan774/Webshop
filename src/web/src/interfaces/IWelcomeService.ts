import { GameResult } from "@shared/types";

export abstract class IWelcomeService {
    public abstract getAllGames(): Promise<GameResult[]>;
    public abstract getSession(): Promise<string>;
    public abstract deleteSession(): Promise<void>;
    public abstract getWelcome(): Promise<string>;
    public abstract getSecret(): Promise<string>;
}
