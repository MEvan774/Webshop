import { html } from "@web/helpers/webComponents";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class CurrentGameComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <div>
                <div>
                    <h1 id="currentGameName">Game name</h1><br>

                    <div id="currentGameMainFloat">
                        <div id="currentGameImage">Game image</div>

                        <div id="currentGameTextDiv">
                            <p id="currentGameText">Game text</p><br>
                            <div id="currentGameRating">Game rating</div><br>
                            <p>Developers: </p><br>
                            <p id="currentGameDevelopers">Developer names</p><br>
                            <div id="currentGameTags">Tags</div><br>
                        </div>
                    </div>

                    <div id="currentGameImagesDiv">Other images</div><br>

                    <div id="currentGameButtonsDiv">
                        <button id="currentGameBuyButton" class="currentGameButtons">Koop nu!</button>
                        <button id="currentGamePriceButton" class="currentGameButtons">Price</button>
                        <button id="currentGameHeartButton">Favorites</button>
                    </div>

                    <h2>Reviews:</h2>
                    
                    <div id="currentGameReviewsDiv">This game has no reviews yet.</div>
                </div>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-currentgame", CurrentGameComponent);
