import { html } from "@web/helpers/webComponents";
import { StripePaymentService } from "@web/services/StripePaymentService";
import { ShoppingCartService } from "@web/services/ShoppingCartService";

/**
 * Component that shows the payment result after returning from Stripe.
 * Styled to match the LucaStars webshop brand.
 */
export class OrderStatusComponent extends HTMLElement {
    private readonly _paymentService: StripePaymentService = new StripePaymentService();
    private _status: string = "loading";

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        await this.loadStatus();
        this.render();
    }

    private async loadStatus(): Promise<void> {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);

        // Check if the customer canceled
        if (urlParams.get("canceled") === "true") {
            this._status = "canceled";
            return;
        }

        // Get the session ID that Stripe puts in the URL
        const sessionId: string | null = urlParams.get("session_id");

        if (!sessionId) {
            this._status = "error";
            return;
        }

        try {
            const result: { status: string; paymentStatus: string } =
                await this._paymentService.getSessionStatus(sessionId);

            if (result.paymentStatus === "paid") {
                this._status = "paid";

                // Clear the cart after a successful payment
                const cartService: ShoppingCartService = new ShoppingCartService();
                cartService.removeAllFromCart();
            }
            else {
                this._status = "open";
            }
        }
        catch {
            this._status = "error";
        }
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = "";

        const display: { title: string; message: string; icon: string; bgColor: string; accentColor: string } = this.getDisplay();

        const style: HTMLStyleElement = document.createElement("style");
        style.textContent = `
            @font-face {
                font-family: 'TimesNewRoman';
                src: url('/assets/fonts/TimesNewRoman.ttf');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: 'TimesNewRomanBold';
                src: url('/assets/fonts/TimesNewRomanBold.ttf');
                font-weight: bold;
                font-style: normal;
            }
            @font-face {
                font-family: 'RaleWay';
                src: url('/assets/fonts/Raleway-Regular.ttf');
                font-weight: normal;
                font-style: normal;
            }

            .container {
                max-width: 480px;
                margin: 60px auto;
                padding: 40px 32px;
                text-align: center;
                background-color: #FFFAF0;
                border-radius: 16px;
                border: 1px solid #e0d6c6;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
            }

            .icon-circle {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                font-size: 2.2rem;
                margin-bottom: 24px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            }

            h1 {
                margin: 0 0 8px;
                font-family: 'TimesNewRomanBold', serif;
                font-size: 1.6rem;
                color: #1B1212;
            }

            .msg {
                font-family: 'RaleWay', sans-serif;
                color: #666;
                font-size: 1rem;
                margin: 0 0 32px;
                line-height: 1.5;
            }

            .btn-primary {
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(90deg, #1C2594, #5BCAF3);
                color: #FFFAF0;
                text-decoration: none;
                border-radius: 10px;
                font-family: 'TimesNewRomanBold', serif;
                font-size: 1rem;
                transition: transform 0.15s ease, box-shadow 0.2s ease;
                box-shadow: 0 4px 16px rgba(28, 37, 148, 0.2);
            }

            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 24px rgba(28, 37, 148, 0.3);
            }

            .btn-secondary {
                display: inline-block;
                padding: 12px 28px;
                background: transparent;
                color: #1C2594;
                text-decoration: none;
                border: 2px solid #1C2594;
                border-radius: 10px;
                font-family: 'TimesNewRomanBold', serif;
                font-size: 0.95rem;
                margin-left: 12px;
                transition: background-color 0.2s ease, color 0.2s ease;
            }

            .btn-secondary:hover {
                background-color: #1C2594;
                color: #FFFAF0;
            }

            .buttons {
                display: flex;
                justify-content: center;
                gap: 12px;
                flex-wrap: wrap;
            }

            @media (max-width: 520px) {
                .container {
                    margin: 24px 16px;
                    padding: 32px 20px;
                }

                .buttons {
                    flex-direction: column;
                    align-items: center;
                }

                .btn-secondary {
                    margin-left: 0;
                }
            }
        `;
        this.shadowRoot.appendChild(style);

        // Build buttons based on status
        let buttonsHTML: string = "";

        switch (this._status) {
            case "paid":
                buttonsHTML = `
                    <a class="btn-primary" href="/">Terug naar de winkel</a>
                `;
                break;
            case "canceled":
                buttonsHTML = `
                    <a class="btn-primary" href="/payment.html">Terug naar winkelwagen</a>
                    <a class="btn-secondary" href="/">Verder winkelen</a>
                `;
                break;
            default:
                buttonsHTML = `
                    <a class="btn-primary" href="/">Terug naar de winkel</a>
                `;
                break;
        }

        const element: HTMLElement = html`
        <div class="container">
            <div class="icon-circle" style="background-color: ${display.bgColor}; color: ${display.accentColor};">
                ${display.icon}
            </div>
            <h1>${display.title}</h1>
            <p class="msg">${display.message}</p>
            <div class="buttons">
                ${buttonsHTML}
            </div>
        </div>
        `;

        this.shadowRoot.append(element);
    }

    private getDisplay(): { title: string; message: string; icon: string; bgColor: string; accentColor: string } {
        switch (this._status) {
            case "paid":
                return {
                    title: "Betaling geslaagd!",
                    message: "Bedankt voor je aankoop. Je ontvangt een bevestiging per e-mail.",
                    icon: "✓",
                    bgColor: "rgba(46, 204, 113, 0.12)",
                    accentColor: "#2ecc71",
                };
            case "canceled":
                return {
                    title: "Betaling geannuleerd",
                    message: "Je hebt de betaling geannuleerd. Je winkelwagen is bewaard.",
                    icon: "✕",
                    bgColor: "rgba(231, 76, 60, 0.1)",
                    accentColor: "#e74c3c",
                };
            case "open":
                return {
                    title: "In afwachting",
                    message: "Je betaling wordt nog verwerkt. Probeer het later opnieuw.",
                    icon: "⏳",
                    bgColor: "rgba(243, 156, 18, 0.1)",
                    accentColor: "#f39c12",
                };
            default:
                return {
                    title: "Er ging iets mis",
                    message: "We konden de status van je betaling niet ophalen. Probeer het opnieuw.",
                    icon: "!",
                    bgColor: "rgba(231, 76, 60, 0.08)",
                    accentColor: "#e74c3c",
                };
        }
    }
}

window.customElements.define("webshop-order-status", OrderStatusComponent);
