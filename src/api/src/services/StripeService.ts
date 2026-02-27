/**
 * Minimal Stripe service for creating Checkout Sessions and checking their status.
 * No database required — just communicates with the Stripe API.
 */
export class StripeService {
    private readonly _stripeApiUrl: string = "https://api.stripe.com/v1";

    /**
     * Get the Stripe Secret API key from environment variables.
     */
    private getSecretKey(): string {
        const secretKey: string | undefined = process.env.STRIPE_SECRET_KEY;

        if (!secretKey) {
            throw new Error("STRIPE_SECRET_KEY is not configured in environment variables.");
        }

        return secretKey;
    }

    /**
     * Create a new Stripe Checkout Session.
     *
     * @param items Array of items with name, price (in euros), and quantity
     * @param successUrl URL to redirect to after successful payment
     * @param cancelUrl URL to redirect to if the customer cancels
     * @returns The Stripe hosted checkout URL
     */
    public async createCheckoutSession(
        items: { name: string; price: number; quantity: number }[],
        successUrl: string,
        cancelUrl: string
    ): Promise<{ checkoutUrl: string; sessionId: string }> {
        const bodyParams: URLSearchParams = new URLSearchParams();
        bodyParams.append("mode", "payment");
        bodyParams.append("success_url", successUrl);
        bodyParams.append("cancel_url", cancelUrl);

        items.forEach((item: { name: string; price: number; quantity: number }, index: number) => {
            bodyParams.append(`line_items[${index}][price_data][currency]`, "eur");
            bodyParams.append(`line_items[${index}][price_data][product_data][name]`, item.name);
            bodyParams.append(`line_items[${index}][price_data][unit_amount]`, Math.round(item.price * 100).toString());
            bodyParams.append(`line_items[${index}][quantity]`, item.quantity.toString());
        });

        const response: Response = await fetch(`${this._stripeApiUrl}/checkout/sessions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${this.getSecretKey()}`,
            },
            body: bodyParams.toString(),
        });

        if (!response.ok) {
            const errorBody: string = await response.text();
            console.error("Stripe API error:", response.status, errorBody);
            throw new Error(`Stripe API error: ${response.status}`);
        }

        const data: { id: string; url: string } = await response.json() as { id: string; url: string };

        return {
            checkoutUrl: data.url,
            sessionId: data.id,
        };
    }

    /**
     * Retrieve a Checkout Session to check its payment status.
     *
     * @param sessionId The Stripe Checkout Session ID
     * @returns The payment status ("paid", "unpaid", or "no_payment_required")
     */
    public async getSessionStatus(sessionId: string): Promise<{ status: string; paymentStatus: string }> {
        const response: Response = await fetch(`${this._stripeApiUrl}/checkout/sessions/${sessionId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.getSecretKey()}`,
            },
        });

        if (!response.ok) {
            const errorBody: string = await response.text();
            console.error("Stripe fetch error:", response.status, errorBody);
            throw new Error(`Failed to fetch session: ${response.status}`);
        }

        const data: { status: string; payment_status: string } =
            await response.json() as { status: string; payment_status: string };

        return {
            status: data.status,
            paymentStatus: data.payment_status,
        };
    }
}
