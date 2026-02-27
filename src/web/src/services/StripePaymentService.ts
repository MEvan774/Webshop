/**
 * Frontend service for Stripe payments.
 * Creates checkout sessions and checks payment status.
 */
export class StripePaymentService {
    /**
     * Start the checkout: create a session and redirect to Stripe.
     *
     * @param items Array of cart items
     */
    public async startCheckout(items: CheckoutItem[]): Promise<void> {
        const response: Response = await fetch(`${VITE_API_URL}payment/create-checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ items }),
        });

        if (!response.ok) {
            const errorData: { error: string } = await response.json() as { error: string };
            throw new Error(errorData.error || "Checkout aanmaken mislukt.");
        }

        const data: { checkoutUrl: string } = await response.json() as { checkoutUrl: string };

        // Redirect to Stripe's hosted payment page
        window.location.href = data.checkoutUrl;
    }

    /**
     * Check the payment status of a session (called when customer returns from Stripe).
     *
     * @param sessionId The Stripe Checkout Session ID from the URL
     * @returns The payment status
     */
    public async getSessionStatus(sessionId: string): Promise<{ status: string; paymentStatus: string }> {
        const response: Response = await fetch(`${VITE_API_URL}payment/session-status/${sessionId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Status ophalen mislukt.");
        }

        return await response.json() as { status: string; paymentStatus: string };
    }
}

/**
 * Represents a cart item for checkout.
 */
export type CheckoutItem = {
    name: string;
    price: number; // Price in euros, e.g. 19.99
    quantity: number;
};
