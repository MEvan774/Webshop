@Interface
export abstract class IShoppingCartService {
    public abstract addToCart(gameId: number, userId: number): Promise<boolean>;
    public abstract removeFromCart(gameId: number, userId: number): Promise<boolean>;
    public abstract removeAllFromCart(userId: number): Promise<boolean>;
}
