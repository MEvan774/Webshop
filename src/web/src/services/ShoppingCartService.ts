export class ShoppingCartService {
    public async addToCart(): Promise<boolean> {
        try {
            const gameId: number = this.getGameId();
            const session: string = this.getSession();

            const response: Response = await fetch(`${VITE_API_URL}cart/add`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ gameId, session }),
            });

            if (response.status === 200) {
                console.log("addToCart succesvol");
                return true;
            }
            else {
                throw new Error("onbekende fout bij het toevoegen aan de winkelwagen, webservice");
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }

    public async removeFromCart(): Promise<boolean> {
        try {
            const gameId: number = this.getGameId();
            const session: string = this.getSession();

            const response: Response = await fetch(`${VITE_API_URL}cart/remove`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ gameId, session }),
            });
            if (response.status === 200) {
                console.log("removeFromCart succesvol");
                return true;
            }
            else {
                throw new Error("Onbekende fout bij het verwijderen van de winkelwagen, webservice");
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }

    public async removeAllFromCart(): Promise<boolean> {
        try {
            const session: string = this.getSession();

            const response: Response = await fetch(`${VITE_API_URL}cart/remove/all`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ session }),
            });
            if (response.status === 200) {
                console.log("removeAllFromCart succesvol");
                return true;
            }
            else {
                throw new Error("Onbekende fout bij het verwijderen van de winkelwagen, webservice");
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }

    private getSession(): string {
        const session: string = document.cookie.split("=;")[1];

        if (!session) {
            throw new Error("Sessie niet gevonden in cookies");
        }

        return session;
    }

    private getGameId(): number {
        const gameIdString: string | null = localStorage.getItem("gameID");
        return gameIdString ? Number(gameIdString) : -1;
    }
}
