/**
 * Represents a single item stored in the shopping cart (localStorage).
 */
export type CartItem = {
    gameId: string;
    title: string;
    thumbnail: string;
    price: number;
    quantity: number;
};

const CART_STORAGE_KEY: string = "shoppingCart";

/**
 * Shopping cart service that persists cart data in localStorage.
 * No API calls needed — everything is stored client-side.
 */
export class ShoppingCartService {
    /**
     * Get all items currently in the cart.
     *
     * @returns Array of CartItem objects
     */
    public getCartItems(): CartItem[] {
        try {
            const raw: string | null = localStorage.getItem(CART_STORAGE_KEY);

            if (!raw) {
                return [];
            }

            return JSON.parse(raw) as CartItem[];
        }
        catch (error) {
            console.error("Fout bij het laden van de winkelwagen:", error);
            return [];
        }
    }

    /**
     * Save the cart items array to localStorage.
     *
     * @param items The full cart array to persist
     */
    private saveCartItems(items: CartItem[]): void {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }

    /**
     * Add a game to the cart. If it already exists, increment the quantity.
     *
     * @param gameId    The CheapShark game ID
     * @param title     Display title of the game
     * @param thumbnail Thumbnail URL
     * @param price     Price in euros
     * @returns true if successful
     */
    public addToCart(gameId: string, title: string, thumbnail: string, price: number): boolean {
        try {
            const items: CartItem[] = this.getCartItems();
            const existing: CartItem | undefined = items.find((item: CartItem) => item.gameId === gameId);

            if (existing) {
                existing.quantity += 1;
            }
            else {
                items.push({ gameId, title, thumbnail, price, quantity: 1 });
            }

            this.saveCartItems(items);
            console.log("addToCart succesvol:", title);
            return true;
        }
        catch (error) {
            console.error("Fout bij het toevoegen aan de winkelwagen:", error);
            return false;
        }
    }

    /**
     * Remove one quantity of a game from the cart.
     * If quantity reaches 0, the item is removed entirely.
     *
     * @param gameId The game ID to remove
     * @returns true if successful
     */
    public removeFromCart(gameId: string): boolean {
        try {
            let items: CartItem[] = this.getCartItems();
            const existing: CartItem | undefined = items.find((item: CartItem) => item.gameId === gameId);

            if (existing) {
                existing.quantity -= 1;

                if (existing.quantity <= 0) {
                    items = items.filter((item: CartItem) => item.gameId !== gameId);
                }
            }

            this.saveCartItems(items);
            console.log("removeFromCart succesvol:", gameId);
            return true;
        }
        catch (error) {
            console.error("Fout bij het verwijderen uit de winkelwagen:", error);
            return false;
        }
    }

    /**
     * Completely remove a game from the cart (regardless of quantity).
     *
     * @param gameId The game ID to delete
     * @returns true if successful
     */
    public deleteFromCart(gameId: string): boolean {
        try {
            const items: CartItem[] = this.getCartItems().filter(
                (item: CartItem) => item.gameId !== gameId
            );

            this.saveCartItems(items);
            console.log("deleteFromCart succesvol:", gameId);
            return true;
        }
        catch (error) {
            console.error("Fout bij het verwijderen uit de winkelwagen:", error);
            return false;
        }
    }

    /**
     * Remove all items from the cart.
     *
     * @returns true if successful
     */
    public removeAllFromCart(): boolean {
        try {
            localStorage.removeItem(CART_STORAGE_KEY);
            console.log("removeAllFromCart succesvol");
            return true;
        }
        catch (error) {
            console.error("Fout bij het legen van de winkelwagen:", error);
            return false;
        }
    }

    /**
     * Get the total number of items in the cart.
     *
     * @returns Total quantity across all items
     */
    public getCartCount(): number {
        return this.getCartItems().reduce(
            (total: number, item: CartItem) => total + item.quantity, 0
        );
    }

    /**
     * Get the total price of all items in the cart.
     *
     * @returns Total price in euros
     */
    public getCartTotal(): number {
        return this.getCartItems().reduce(
            (total: number, item: CartItem) => total + (item.price * item.quantity), 0
        );
    }
}
