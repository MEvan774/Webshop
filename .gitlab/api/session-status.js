/**
 * Vercel Serverless Function — GET /api/session-status?sessionId=cs_...
 *
 * Checks the payment status of a Stripe Checkout Session.
 * Called when the customer returns from Stripe.
 */
export default async function handler(req, res) {
    // --- CORS headers ---
    const allowedOrigins = [
        "http://localhost:3000",
        "https://webshop-api-4vlr.vercel.app",
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin) || (origin && origin.endsWith(".vercel.app"))) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { sessionId } = req.query;

        if (!sessionId) {
            return res.status(400).json({ error: "Session ID is verplicht." });
        }

        const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

        if (!STRIPE_SECRET_KEY) {
            console.error("STRIPE_SECRET_KEY is not configured.");
            return res.status(500).json({ error: "Payment service is not configured." });
        }

        const stripeResponse = await fetch(
            `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
                },
            }
        );

        if (!stripeResponse.ok) {
            const errorBody = await stripeResponse.text();
            console.error("Stripe fetch error:", stripeResponse.status, errorBody);
            return res.status(500).json({ error: "Fout bij het ophalen van de betalingsstatus." });
        }

        const data = await stripeResponse.json();

        return res.status(200).json({
            status: data.status,
            paymentStatus: data.payment_status,
        });
    } catch (error) {
        console.error("Error fetching session status:", error);
        return res.status(500).json({ error: "Fout bij het ophalen van de betalingsstatus." });
    }
}
