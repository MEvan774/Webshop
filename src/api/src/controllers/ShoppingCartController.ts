import { ShoppingCartService } from "@api/services/ShoppingCartService";
import { Request, Response } from "express";

export class ShoppingCartController {
    private readonly cartService: ShoppingCartService = new ShoppingCartService();

    public async addToCart(req: Request, res: Response): Promise<boolean> {
        try {
            const { gameId, userId } = req.body as { gameId: number; userId: number };
            await this.cartService.addToCart(gameId, userId);

            res.status(200).json({ message: "addToCart succesvol (api_controller)" });

            return true;
        }
        catch (error) {
            console.error(error);
            res.status(404).json({ message: "addToCart gefaald (api_controller)" });
            return false;
        }
    }

    public async removeFromCart(req: Request, res: Response): Promise<void> {
        try {
            const { gameId, userId } = req.body as { gameId: number; userId: number };
            await this.cartService.removeFromCart(gameId, userId);
            res.status(200).json({ message: "removeFromCart succesvol (api_controller)" });
        }
        catch (error) {
            console.error(error);
            res.status(404).json({ message: "removeFromCart gefaald (api_controller)" });
        }
    }

    public async removeAllFromCart(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body as { userId: number };

            await this.cartService.removeAllFromCart(userId);
            res.status(200).json({ message: "removeAllFromCart succesvol (api_controller)" });
        }
        catch (error) {
            console.error(error);
            res.status(404).json({ message: "removeAllFromCart gefaald (api_controller)" });
        }
    }
}
