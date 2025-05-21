import { html } from "@web/helpers/webComponents";
import { ShoppingCartService } from "@web/services/ShoppingCartService";

export class PaymentTileComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = "";

        const element: HTMLElement = html`
        <div class="gameTile">
            <img id="gameImage" src="/assets/img/temp/Frontpage.png">
            <p id="gameName">Kidnapped: Castle Breakout</p>
            <p id="gamePrice">19,99</p>
            <div id="gameButtons">
                <button class="icon" id="heart"><img src="/assets/img/icons/heart.svg"></button>
                <button class="icon" id="trash"><img src="/assets/img/icons/trash.svg"></button>
            </div>
        </div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/paymentTile.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);

        const trashButton: HTMLButtonElement = document.querySelector("#trash")!;
        trashButton.addEventListener("click", () => new ShoppingCartService().removeFromCart());
    }
}

window.customElements.define("payment-tile", PaymentTileComponent);
