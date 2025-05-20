import { GameResult } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { getGameByID } from "@web/services/CurrentGameService";
import { ShoppingCartService } from "@web/services/ShoppingCartService";

export class CurrentGameComponent extends HTMLElement {
    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        await this.render();
    }

    private async getCurrentGame(): Promise<GameResult | null> {
        return await getGameByID();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const currentGame: GameResult | null = await this.getCurrentGame();
        let element: HTMLElement;

        // Checks if game exists
        if (!currentGame) {
            element = html`<div>Geen spel gevonden.</div>`;
            if (this.shadowRoot.firstChild) {
                this.shadowRoot.firstChild.remove();
            }
            this.shadowRoot.append(element);
            return;
        }

        // If we get here, we know currentGame is not null
        const authors: string = currentGame.authors && currentGame.authors.length
            ? currentGame.authors
                .map((author: string, index: number): string =>
                    index === 0 ? author : `, ${author}`)
                .join("")
            : "Auteurs onbekend.";

        // Create images HTML
        let imagesHTML: string = "";

        if (currentGame.images) {
            imagesHTML = currentGame.images.length
                ? currentGame.images
                    .map((image: string): string =>
                        `<img src='${image}' height=180px>`)
                    .join("")
                : "";
        }

        const tags: string = currentGame.tags?.length
            ? currentGame.tags.join(", ")
            : "Geen tags beschikbaar.";

        // Create reviews section
        let reviewsHTML: string = "Er zijn nog geen reviews.";

        if (currentGame.reviews) {
            reviewsHTML = currentGame.reviews.length > 0
                ? currentGame.reviews.join("<br>")
                : "Er zijn nog geen reviews.";
        }

        element = html`
            <div>
                <div>
                    <h1 id="currentGameName">${currentGame.title}</h1>

                    <div id="currentGameMainFloat">
                        <img src="${currentGame.thumbnail}" alt="Game thumbnail">

                        <div id="currentGameTextDiv">
                            <div id="currentGameText">${currentGame.descriptionHtml}</div><br>
                            <p>Developers: </p><br>
                            <p id="currentGameDevelopers">${authors}</p><br>
                            <div id="currentGameTags">${tags}</div><br>
                        </div>
                    </div>

                    <div id="currentGameImagesDiv">${imagesHTML}</div><br>

                    <div id="currentGameButtonsDiv">
                        <button id="currentGameBuyButton" class="currentGameButtons">
                            <img src="/assets/images/koopButton.png" height="80px">
                        </button>

                        <button id="currentGameHeartButton">
                            <img src="/assets/images/heartButton.png" height="80px">
                        </button>
                    </div>

                    <h2>Reviews:</h2>
                    <div id="currentGameReviewsDiv">${reviewsHTML}</div>
                </div>
            </div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/currentGame.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);

        const buyButton: HTMLButtonElement = document.querySelector("#currentGameBuyButton")!;
        buyButton.addEventListener("click", () => new ShoppingCartService().addToCart());
    }
}

window.customElements.define("webshop-currentgame", CurrentGameComponent);
