import { GameResult, GameWithPrices, ProductPrice, SalePrices } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { AllGameService } from "@web/services/AllGamesService";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class WelcomeComponent extends HTMLElement {
    // private salePrices: Record<number, ProductPrice[]> = {};

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        await this.addGames();
        this.render();
    }

    private frontPageGames: GameResult[] = [];
    private saleGamesWithPrices: GameWithPrices[] = [];
    private saleGamesGame: GameResult[] = [];
    private saleGames: SalePrices[] = [];

    private async addGames(): Promise<void> {
        const games: GameResult[] | null = await this.getAllGames();
        if (!games) return;

        const frontPageIndexes: number[] = [36, 3, 5, 40, 41];
        const saleIndexes: number[] = [12, 11, 8, 7, 9, 15, 19, 20];

        // 1. Vul frontPageGames met de juiste games
        this.frontPageGames = frontPageIndexes.map(i => games[i]);

        // 2. Pak sale games zonder prijzen
        const saleGames: GameResult[] = saleIndexes.map(i => games[i]);

        this.saleGamesGame = saleGames;

        // 3. Filter geldige gameIDs (als numbers)
        const validGameIds: number[] = saleGames
            .filter(g => g.gameId && !isNaN(Number(g.gameId)))
            .map(g => Number(g.gameId));

        if (validGameIds.length === 0) {
            console.warn("Geen geldige gameIDs gevonden.");
            return;
        }

        // 4. Haal alle prijzen in 1 call
        const pricesByGameId: Record<string, ProductPrice> | null = await this.getProductPrices(validGameIds);

        if (!pricesByGameId) {
            console.warn("Kon geen prijzen ophalen voor sale games.");
            return;
        }

        if (this.saleGamesWithPrices.length < 0) {
            return;
        }

        for (let x: number = 0; x < this.saleGamesGame.length; x++) {
            const salePrice: number = pricesByGameId[x].price / 4 * 3;

            const saleGame: SalePrices = {
                gameId: this.saleGamesGame[x].gameId,
                oldPrice: pricesByGameId[x].price,
                newPrice: salePrice,
            };

            this.saleGames.push(saleGame);
        }
    }

    // private welcomeService: WelcomeService = new WelcomeService();

    private async getAllGames(): Promise<GameResult[] | null> {
        const allGames: AllGameService = new AllGameService();
        return await allGames.getAllGames();
    }

    private async getProductPrices(productIds: number[]): Promise<Record<number, ProductPrice> | null> {
        const productPrice: AllGameService = new AllGameService();
        return await productPrice.getGamePrices(productIds);
    }

    // public games: GameResult = await getAllGames();

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
<div class="frontpage">
  <!-- Hero Banner -->
   <h1>Aanbevolen</h1>
   <p>Ontdek onze sterren!</p>
   <section class="hero-banner">
  <!-- Left: Main featured game -->
  <div class="hero-main" id="hero-main">
    <a href="/currentGame?gameId=${this.frontPageGames[0].gameId}">
    <img src=${this.frontPageGames[0].thumbnail} alt="Featured Game" />
    <div class="hero-text">
      <h1>${this.frontPageGames[0].title}</h1>
      <button>Koop nu!</button>
    </div>
    </a>
  </div>

  <!-- Right: Vertical list of other games -->
  <div class="hero-side-list">
    <div class="side-game">
    <a href="/currentGame?gameId=${this.frontPageGames[1].gameId}">
      <img src=${this.frontPageGames[1].thumbnail} alt="Game 1" />
      <p>${this.frontPageGames[1].title}</p>
    </a>
    </div>
    <div class="side-game">
    <a href="/currentGame?gameId=${this.frontPageGames[2].gameId}">
      <img src=${this.frontPageGames[2].thumbnail} alt="Game 2" />
      <p>${this.frontPageGames[2].title}</p>
    </a>
    </div>
    <div class="side-game">
    <a href="/currentGame?gameId=${this.frontPageGames[4].gameId}">
      <img src=${this.frontPageGames[3].thumbnail} alt="Game 3" />
      <p>${this.frontPageGames[3].title}</p>
    </a>
    </div>
    <div class="side-game">
    <a href="/currentGame?gameId=${this.frontPageGames[4].gameId}">
      <img src=${this.frontPageGames[4].thumbnail} alt="Game 4" />
      <p>${this.frontPageGames[4].title}</p>
    </a>
    </div>
  </div>
</section>

  <!-- Discover Row -->
  <section class="discover">
    <h2>Uitverkoop</h2>
    <p>Alle geweldige deals, in één plek!</p>
    <div class="scroll-section">
  <div class="scroll-arrow left">
  <img src="assets/img/ui/Arrow.svg">
  </div>
    <div class="horizontal-scroll">
      <div class="game-card">
      <a href="/currentGame?gameId=${this.saleGamesGame[0].gameId}">
        <img src= ${this.saleGamesGame[0].thumbnail} alt="Game 1" />
        <p>${this.saleGamesGame[0].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€${this.saleGames[0].oldPrice}</p>
            <p class="discounted-price">€${this.saleGames[0].newPrice.toFixed(2)}</p>
            </div>
      </a>
        <div class="bottom">
        <img src="assets/img/ui/Bottom.svg">
        </div>
    </div>
      <div class="game-card">
      <a href="/currentGame?gameId=${this.saleGamesGame[1].gameId}">
        <img src=${this.saleGamesGame[1].thumbnail} alt="Game 2" />
        <p>${this.saleGamesGame[1].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€${this.saleGames[1].oldPrice}</p>
            <p class="discounted-price">€${this.saleGames[1].newPrice.toFixed(2)}</p>
      </div>
      </a>
        <div class="bottom">
        <img src="assets/img/ui/Bottom.svg">
        </div>
      </div>
      <div class="game-card">
      <a href="/currentGame?gameId=${this.saleGamesGame[2].gameId}">
        <img src=${this.saleGamesGame[2].thumbnail} alt="Game 2" />
        <p>${this.saleGamesGame[2].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€${this.saleGames[2].oldPrice}</p>
            <p class="discounted-price">€${this.saleGames[2].newPrice.toFixed(2)}</p>
        </div>
        </a>
        <div class="bottom">
        <img src="assets/img/ui/Bottom.svg">
        </div>
      </div>
      <div class="game-card">
      <a href="/currentGame?gameId=${this.saleGamesGame[3].gameId}">
        <img src=${this.saleGamesGame[3].thumbnail} alt="Game 2" />
        <p>${this.saleGamesGame[3].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€${this.saleGames[3].oldPrice}</p>
            <p class="discounted-price">€${this.saleGames[3].newPrice.toFixed(2)}</p>
        </div>
        </a>
        <div class="bottom">
        <img src="assets/img/ui/Bottom.svg">
        </div>
      </div>
      <div class="game-card">
      <a href="/currentGame?gameId=${this.saleGamesGame[4].gameId}">
        <img src=${this.saleGamesGame[4].thumbnail} alt="Game 2" />
        <p>${this.saleGamesGame[4].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€${this.saleGames[4].oldPrice}</p>
            <p class="discounted-price">€${this.saleGames[4].newPrice.toFixed(2)}</p>
      </div>
      </a>
      <div class="bottom">
      <img src="assets/img/ui/Bottom.svg">
      </div>
    </div>
    <div class="game-card">
      <a href="/currentGame?gameId=${this.saleGamesGame[5].gameId}">
        <img src=${this.saleGamesGame[5].thumbnail} alt="Game 2" />
        <p>${this.saleGamesGame[5].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€${this.saleGames[5].oldPrice}</p>
            <p class="discounted-price">€${this.saleGames[5].newPrice.toFixed(2)}</p>
            </div>
      </a>
      <div class="bottom">
      <img src="assets/img/ui/Bottom.svg">
      </div>
    </div>
    <div class="game-card">
      <a href="/currentGame?gameId=${this.saleGamesGame[6].gameId}">
        <img src=${this.saleGamesGame[6].thumbnail} alt="Game 2" />
        <p>${this.saleGamesGame[6].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€${this.saleGames[6].oldPrice}</p>
            <p class="discounted-price">€${this.saleGames[6].newPrice.toFixed(2)}</p>
      </div>
      </a>
      <div class="bottom">
      <img src="assets/img/ui/Bottom.svg">
      </div>
    </div>
    <div class="game-card">
      <a href="/currentGame?gameId=${this.saleGamesGame[7].gameId}">
        <img src=${this.saleGamesGame[7].thumbnail} alt="Game 2" />
        <p>${this.saleGamesGame[7].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€${this.saleGames[7].oldPrice}</p>
            <p class="discounted-price">€${this.saleGames[7].newPrice.toFixed(2)}</p>  
    </div>
      </a>
        <div class="bottom">
        <img src="assets/img/ui/Bottom.svg">
        </div>
    </div>
    <!-- Add more cards -->
</div>
<div class="scroll-arrow right">
    <img src="assets/img/ui/Arrow.svg">
</div>
</div>
</section>
</div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/welcome.css");

        // Clear existing content first
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(element);
        this.shadowRoot.appendChild(styleLink);

        // Wait for content to be in DOM before querying
        const scrollContainer: HTMLElement = this.shadowRoot.querySelector(".horizontal-scroll") as HTMLElement;
        const scrollLeftBtn: HTMLElement = this.shadowRoot.querySelector(".scroll-arrow.left") as HTMLElement;
        const scrollRightBtn: HTMLElement = this.shadowRoot.querySelector(".scroll-arrow.right") as HTMLElement;

        const scrollAmount: number = 230;

        scrollLeftBtn.addEventListener("click", () => {
            scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        });

        scrollRightBtn.addEventListener("click", () => {
            scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });

        this.shadowRoot.appendChild(styleLink);
    }
}
window.customElements.define("webshop-welcome", WelcomeComponent);
