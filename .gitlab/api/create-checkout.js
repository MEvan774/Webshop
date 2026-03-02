/**
 * Vercel Serverless Function — POST /api/create-checkout
 *
 * Creates a Stripe Checkout Session and returns the checkout URL.
 * This runs on Vercel's infrastructure (not Railway), so outbound
 * HTTPS to api.stripe.com works without issues.
 *
 * Environment variable required in Vercel dashboard:
 *   STRIPE_SECRET_KEY = sk_test_... or sk_live_...
 */
export default async function handler(req, res) {
    // --- CORS headers (allow your Vercel frontend + localhost) ---
    const allowedOrigins = [
        "http://localhost:3000",
        "https://webshop-api-4vlr.vercel.app",
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin) || (origin && origin.endsWith(".vercel.app"))) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Handle preflight
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Winkelwagen is leeg." });
        }

        const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

        if (!STRIPE_SECRET_KEY) {
            console.error("STRIPE_SECRET_KEY is not configured.");
            return res.status(500).json({ error: "Payment service is not configured." });
        }

        // Build the Stripe API request body
        const bodyParams = new URLSearchParams();
        bodyParams.append("mode", "payment");

        // Use the request origin for redirect URLs
        const webBaseUrl = origin || "https://webshop-api-4vlr.vercel.app";
        bodyParams.append("success_url", `${webBaseUrl}/order-status.html?session_id={CHECKOUT_SESSION_ID}`);
        bodyParams.append("cancel_url", `${webBaseUrl}/payment.html?canceled=true`);

        items.forEach((item, index) => {
            bodyParams.append(`line_items[${index}][price_data][currency]`, "eur");
            bodyParams.append(`line_items[${index}][price_data][product_data][name]`, item.name);
            bodyParams.append(
                `line_items[${index}][price_data][unit_amount]`,
                Math.round(item.price * 100).toString()
            );
            bodyParams.append(`line_items[${index}][quantity]`, item.quantity.toString());
        });

        // Call the Stripe API
        const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            },
            body: bodyParams.toString(),
        });

        if (!stripeResponse.ok) {
            const errorBody = await stripeResponse.text();
            console.error("Stripe API error:", stripeResponse.status, errorBody);
            return res.status(500).json({ error: "Stripe API fout." });
        }

        const data = await stripeResponse.json();

        return res.status(201).json({
            checkoutUrl: data.url,
            sessionId: data.id,
        });
    } catch (error) {
        console.error("Error creating checkout:", error);
        return res.status(500).json({ error: "Fout bij het aanmaken van de betaling." });
    }
}
