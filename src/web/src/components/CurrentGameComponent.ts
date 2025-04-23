import { GameResult } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { getGameByID } from "@web/services/CurrentGameService";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class CurrentGameComponent extends HTMLElement {
    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });

        await this.render();
    }

    private async getCurrentGame(): Promise<GameResult | null> {
        return await getGameByID();
    }

    private async render(): Promise<void> {
        // Get current game
        const currentGame: GameResult | null = await this.getCurrentGame();

        let element: HTMLElement;

        if (!this.shadowRoot) {
            return;
        }

        if (currentGame) {
            // Make a string with the authors
            let authors: string = "";

            for (let x: number = 0; x < currentGame.authors.length; x++) {
                if (x !== 0) {
                    authors += ", ";
                }

                authors += currentGame.authors[x];
            }

            // Make HTML for the images string
            let imagesHTML: string = "";

            for (let x: number = 0; x < currentGame.images.length; x++) {
                imagesHTML += "<img src='" + currentGame.images[x] + "'>";
            }

            element = html`
            <div>
                <div>
                    <h1 id="currentGameName">${currentGame.title}</h1><br>

                    <div id="currentGameMainFloat">
                        <img src="${currentGame.thumbnail}">

                        <div id="currentGameTextDiv">
                            <div id="currentGameText">${currentGame.descriptionHtml}</p><br>
                            <p>Developers: </p><br>
                            <p id="currentGameDevelopers">${authors}</p><br>
                            <div id="currentGameTags">${currentGame.tags}</div><br>
                        </div>
                    </div>

                    <div id="currentGameImagesDiv">${imagesHTML}</div><br>

                    <div id="currentGameButtonsDiv">
                        <button id="currentGameBuyButton" class="currentGameButtons">Koop nu!</button>
                        <button id="currentGamePriceButton" class="currentGameButtons">Price</button>
                        <button id="currentGameHeartButton">Favorites</button>
                    </div>

                    <h2>Reviews:</h2>
                    
                    <div id="currentGameReviewsDiv">This game has no reviews yet.</div>
                </div>
            </div>
        </div>
        `;
        }
        else {
            element = html``;
        }

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-currentgame", CurrentGameComponent);
