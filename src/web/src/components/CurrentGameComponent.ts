import { GameResult } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { getGameByID } from "@web/services/CurrentGameService";

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

        if (currentGame) {
            // Create authors string
            const authors: string = currentGame.authors
                .map((author: string, index: number): string =>
                    index === 0 ? author : `, ${author}`)
                .join("");

            // Create images HTML
            const imagesHTML: string = currentGame.images
                .map((image: string): string => `<img src='${image}' alt="Game screenshot">`)
                .join("");

            // Create reviews section
            const reviewsHTML: string = currentGame.reviews.length > 0
                ? currentGame.reviews.join("<br>")
                : "This game has no reviews yet.";

            element = html`
                <div>
                    <div>
                        <h1 id="currentGameName">${currentGame.title}</h1>
                        <p>SKU: ${currentGame.SKU}</p><br>

                        <div id="currentGameMainFloat">
                            <img src="${currentGame.thumbnail}" alt="Game thumbnail">

                            <div id="currentGameTextDiv">
                                <div id="currentGameText">${currentGame.descriptionHtml}</div><br>
                                <p>Developers: </p><br>
                                <p id="currentGameDevelopers">${authors}</p><br>
                                <div id="currentGameTags">${currentGame.tags.join(", ")}</div><br>
                                <p>Game URL: <a href="${currentGame.url}" target="_blank">${currentGame.url}</a></p>
                            </div>
                        </div>

                        <div id="currentGameImagesDiv">${imagesHTML}</div><br>

                        <div id="currentGameButtonsDiv">
                            <button id="currentGameBuyButton" class="currentGameButtons">Koop nu!</button>
                            <button id="currentGamePriceButton" class="currentGameButtons">Price</button>
                            <button id="currentGameHeartButton">Favorites</button>
                        </div>

                        <h2>Reviews:</h2>
                        <div id="currentGameReviewsDiv">${reviewsHTML}</div>
                    </div>
                </div>
            `;
        }
        else {
            element = html`<div>No game found</div>`;
        }

        if (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-currentgame", CurrentGameComponent);
