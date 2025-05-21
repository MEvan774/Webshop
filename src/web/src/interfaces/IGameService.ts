import { GameResult, ProductPrice } from "@shared/types";

export abstract class IGameService {
    public abstract getAllGames(): Promise<GameResult[]>;
    public abstract getGamePrices(gameIds: number[]): Promise<Record<number, ProductPrice> | null>;
}
