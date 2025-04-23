import { GameResult } from "@shared/types";

@Interface
export abstract class IGamesService {
    public abstract getAllGames(): Promise<GameResult[]>;
}
