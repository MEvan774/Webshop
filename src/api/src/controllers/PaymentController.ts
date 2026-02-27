import { StripeService } from "@api/services/StripeService";
import { Request, Response } from "express";

/**
 * Controller for payment endpoints.
 * Creates Stripe Checkout Sessions and checks payment status.
 */
export class PaymentController {
    private readonly _stripeService: StripeService = new StripeService();

    /**
     * POST /payment/create-checkout
     *
     * Request body:
     * - items: Array of { name: string, price: number, quantity: number }
     *
     * Returns the Stripe checkout URL to redirect the customer to.
     */
    public async createCheckout(req: Request, res: Response): Promise<void> {
        try {
            const { items } = req.body as {
                items: { name: string; price: number; quantity: number }[];
            };

            if (!Array.isArray(items) || items.length === 0) {
                res.status(400).json({ error: "Winkelwagen is leeg." });
                return;
            }

            const webBaseUrl: string = process.env.WEB_URL || req.headers.origin || "http://localhost:3000";

            const result: { checkoutUrl: string; sessionId: string } =
                await this._stripeService.createCheckoutSession(
                    items,
                    `${webBaseUrl}/order-status.html?session_id={CHECKOUT_SESSION_ID}`,
                    `${webBaseUrl}/payment.html?canceled=true`
                );

            res.status(201).json({
                checkoutUrl: result.checkoutUrl,
                sessionId: result.sessionId,
            });
        }
        catch (error) {
            console.error("Error creating checkout:", error);
            res.status(500).json({ error: "Fout bij het aanmaken van de betaling." });
        }
    }

    /**
     * GET /payment/session-status/:sessionId
     *
     * Checks the payment status of a Stripe Checkout Session.
     * Called when the customer returns from Stripe.
     */
    public async getSessionStatus(req: Request, res: Response): Promise<void> {
        try {
            const { sessionId } = req.params;

            if (!sessionId) {
                res.status(400).json({ error: "Session ID is verplicht." });
                return;
            }

            const result: { status: string; paymentStatus: string } =
                await this._stripeService.getSessionStatus(sessionId);

            res.status(200).json(result);
        }
        catch (error) {
            console.error("Error fetching session status:", error);
            res.status(500).json({ error: "Fout bij het ophalen van de betalingsstatus." });
        }
    }
}
