import { html } from "@web/helpers/webComponents";
import { StripePaymentService } from "@web/services/StripePaymentService";

/**
 * Component that shows the payment result after returning from Stripe.
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

            this._status = result.paymentStatus === "paid" ? "paid" : "open";
        }
        catch {
            this._status = "error";
        }
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = "";

        const display: { title: string; message: string; icon: string; color: string } = this.getDisplay();

        const style: HTMLStyleElement = document.createElement("style");
        style.textContent = `
            .container { max-width: 500px; margin: 4rem auto; padding: 2rem; text-align: center; }
            .icon { display: inline-flex; align-items: center; justify-content: center;
                    width: 80px; height: 80px; border-radius: 50%; font-size: 2.5rem; margin-bottom: 1.5rem; }
            h1 { margin: 0 0 0.5rem; font-size: 1.5rem; }
            .msg { color: #666; margin-bottom: 2rem; }
            .btn { display: inline-block; padding: 0.75rem 2rem; background: #3498db;
                   color: white; text-decoration: none; border-radius: 8px; }
            .btn:hover { background: #2980b9; }
        `;
        this.shadowRoot.appendChild(style);

        const element: HTMLElement = html`
        <div class="container">
            <div class="icon" style="background-color: ${display.color}">${display.icon}</div>
            <h1>${display.title}</h1>
            <p class="msg">${display.message}</p>
            <a class="btn" href="/">Terug naar de winkel</a>
        </div>
        `;

        this.shadowRoot.append(element);
    }

    private getDisplay(): { title: string; message: string; icon: string; color: string } {
        switch (this._status) {
            case "paid":
                return { title: "Betaling geslaagd!", message: "Bedankt voor je aankoop.", icon: "✅", color: "#2ecc71" };
            case "canceled":
                return { title: "Betaling geannuleerd", message: "Je hebt de betaling geannuleerd.", icon: "❌", color: "#e74c3c" };
            case "open":
                return { title: "In afwachting", message: "Je betaling wordt nog verwerkt.", icon: "⏳", color: "#f39c12" };
            default:
                return { title: "Er ging iets mis", message: "Probeer het opnieuw.", icon: "⚠️", color: "#e74c3c" };
        }
    }
}

window.customElements.define("webshop-order-status", OrderStatusComponent);
