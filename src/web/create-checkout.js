export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { items } = req.body;
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    const bodyParams = new URLSearchParams();
    bodyParams.append('mode', 'payment');
    bodyParams.append('success_url', `${req.headers.origin}/order-status.html?session_id={CHECKOUT_SESSION_ID}`);
    bodyParams.append('cancel_url', `${req.headers.origin}/payment.html?canceled=true`);

    items.forEach((item, index) => {
        bodyParams.append(`line_items[${index}][price_data][currency]`, 'eur');
        bodyParams.append(`line_items[${index}][price_data][product_data][name]`, item.name);
        bodyParams.append(`line_items[${index}][price_data][unit_amount]`, Math.round(item.price * 100).toString());
        bodyParams.append(`line_items[${index}][quantity]`, item.quantity.toString());
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        },
        body: bodyParams.toString(),
    });

    const data = await response.json();
    res.status(response.ok ? 201 : 500).json({
        checkoutUrl: data.url,
        sessionId: data.id,
    });
}
