/**
 * Represents a single game stored in the favorites/wishlist (localStorage).
 */
export type FavoriteItem = {
    gameId: string;
    title: string;
    thumbnail: string;
};

const FAVORITES_STORAGE_KEY: string = "favorites";

/**
 * Favorites service that persists wishlist data in localStorage.
 * Works similarly to the ShoppingCartService but without quantities.
 */
export class FavoritesService {
    /**
     * Get all favorited games.
     *
     * @returns Array of FavoriteItem objects
     */
    public getFavorites(): FavoriteItem[] {
        try {
            const raw: string | null = localStorage.getItem(FAVORITES_STORAGE_KEY);

            if (!raw) {
                return [];
            }

            return JSON.parse(raw) as FavoriteItem[];
        }
        catch (error) {
            console.error("Fout bij het laden van favorieten:", error);
            return [];
        }
    }

    /**
     * Save the favorites array to localStorage.
     *
     * @param items The full favorites array to persist
     */
    private saveFavorites(items: FavoriteItem[]): void {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
    }

    /**
     * Add a game to favorites. If it already exists, do nothing.
     *
     * @param gameId    The CheapShark game ID
     * @param title     Display title of the game
     * @param thumbnail Thumbnail URL
     * @returns true if added, false if already existed or error
     */
    public addToFavorites(gameId: string, title: string, thumbnail: string): boolean {
        try {
            const items: FavoriteItem[] = this.getFavorites();
            const exists: boolean = items.some((item: FavoriteItem) => item.gameId === gameId);

            if (exists) {
                return false;
            }

            items.push({ gameId, title, thumbnail });
            this.saveFavorites(items);
            console.log("addToFavorites succesvol:", title);
            return true;
        }
        catch (error) {
            console.error("Fout bij het toevoegen aan favorieten:", error);
            return false;
        }
    }

    /**
     * Remove a game from favorites.
     *
     * @param gameId The game ID to remove
     * @returns true if successful
     */
    public removeFromFavorites(gameId: string): boolean {
        try {
            const items: FavoriteItem[] = this.getFavorites().filter(
                (item: FavoriteItem) => item.gameId !== gameId
            );

            this.saveFavorites(items);
            console.log("removeFromFavorites succesvol:", gameId);
            return true;
        }
        catch (error) {
            console.error("Fout bij het verwijderen uit favorieten:", error);
            return false;
        }
    }

    /**
     * Toggle a game's favorite status. Adds if not favorited, removes if already favorited.
     *
     * @param gameId    The CheapShark game ID
     * @param title     Display title of the game
     * @param thumbnail Thumbnail URL
     * @returns true if the game is now favorited, false if it was removed
     */
    public toggleFavorite(gameId: string, title: string, thumbnail: string): boolean {
        if (this.isFavorited(gameId)) {
            this.removeFromFavorites(gameId);
            return false;
        }
        else {
            this.addToFavorites(gameId, title, thumbnail);
            return true;
        }
    }

    /**
     * Check if a game is in the favorites.
     *
     * @param gameId The game ID to check
     * @returns true if the game is favorited
     */
    public isFavorited(gameId: string): boolean {
        return this.getFavorites().some((item: FavoriteItem) => item.gameId === gameId);
    }

    /**
     * Get the total number of favorited games.
     *
     * @returns Total count of favorites
     */
    public getFavoritesCount(): number {
        return this.getFavorites().length;
    }

    /**
     * Remove all favorites.
     *
     * @returns true if successful
     */
    public removeAllFavorites(): boolean {
        try {
            localStorage.removeItem(FAVORITES_STORAGE_KEY);
            console.log("removeAllFavorites succesvol");
            return true;
        }
        catch (error) {
            console.error("Fout bij het legen van favorieten:", error);
            return false;
        }
    }
}
