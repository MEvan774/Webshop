import { ShoppingCartService } from "@api/services/ShoppingCartService";
import { Request, Response } from "express";

export class ShoppingCartController {
    private readonly cartService: ShoppingCartService = new ShoppingCartService();

    public addToCart(req: Request, res: Response): boolean {
        try {
            const { gameId, title, thumbnail, price } = req.body as {
                gameId: string; title: string; thumbnail: string; price: number;
            };
            this.cartService.addToCart(gameId, title, thumbnail, price);

            res.status(200).json({ message: "addToCart succesvol (api_controller)" });
            return true;
        }
        catch (error) {
            console.error(error);
            res.status(404).json({ message: "addToCart gefaald (api_controller)" });
            return false;
        }
    }

    public removeFromCart(req: Request, res: Response): void {
        try {
            const { gameId } = req.body as { gameId: string };
            this.cartService.removeFromCart(gameId);
            res.status(200).json({ message: "removeFromCart succesvol (api_controller)" });
        }
        catch (error) {
            console.error(error);
            res.status(404).json({ message: "removeFromCart gefaald (api_controller)" });
        }
    }

    public removeAllFromCart(_req: Request, res: Response): void {
        try {
            this.cartService.removeAllFromCart();
            res.status(200).json({ message: "removeAllFromCart succesvol (api_controller)" });
        }
        catch (error) {
            console.error(error);
            res.status(404).json({ message: "removeAllFromCart gefaald (api_controller)" });
        }
    }
}
