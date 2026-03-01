import { GameResult, ProductPrice, SalePrices } from "@shared/types";
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
    private saleGamesGame: GameResult[] = [];
    private saleGames: SalePrices[] = [];

    private async addGames(): Promise<void> {
        const games: GameResult[] | null = await this.getAllGames();
        if (!games || games.length === 0) return;

        // Shuffle games using Fisher-Yates algorithm
        const shuffled: GameResult[] = [...games];
        for (let i: number = shuffled.length - 1; i > 0; i--) {
            const j: number = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Use first 5 shuffled games as frontpage featured games
        const frontPageCount: number = Math.min(5, shuffled.length);
        this.frontPageGames = shuffled.slice(0, frontPageCount);

        // Use the next 8 games as sale games (no overlap with frontpage)
        const saleStart: number = frontPageCount;
        const saleEnd: number = Math.min(saleStart + 8, shuffled.length);
        const saleGames: GameResult[] = shuffled.slice(saleStart, saleEnd);
        this.saleGamesGame = saleGames;

        // Get game IDs for price fetching (now strings)
        const validGameIds: string[] = saleGames
            .filter((g: GameResult) => g.gameId)
            .map((g: GameResult) => g.gameId);

        if (validGameIds.length === 0) {
            console.warn("Geen geldige gameIDs gevonden.");
            return;
        }

        // Haal alle prijzen op
        const pricesByGameId: Record<string, ProductPrice> | null = await this.getProductPrices(validGameIds);

        if (!pricesByGameId) {
            console.warn("Kon geen prijzen ophalen voor sale games.");
            return;
        }

        // Build sale prices array
        for (let x: number = 0; x < this.saleGamesGame.length; x++) {
            const gameId: string = this.saleGamesGame[x].gameId;
            const priceData: ProductPrice | undefined = pricesByGameId[gameId];

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (priceData) {
                const salePrice: number = priceData.price * 0.75; // 25% discount

                const saleGame: SalePrices = {
                    gameId: gameId,
                    oldPrice: priceData.price,
                    newPrice: salePrice,
                };

                this.saleGames.push(saleGame);
            }
        }
    }

    // private welcomeService: WelcomeService = new WelcomeService();

    private async getAllGames(): Promise<GameResult[] | null> {
        const allGames: AllGameService = new AllGameService();
        return await allGames.getAllGames();
    }

    private async getProductPrices(productIds: string[]): Promise<Record<string, ProductPrice> | null> {
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
    <a href="/currentGame.html?gameId=${this.frontPageGames[0].gameId}">
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
    <a href="/currentGame.html?gameId=${this.frontPageGames[1].gameId}">
      <img src=${this.frontPageGames[1].thumbnail} alt="Game 1" />
      <p>${this.frontPageGames[1].title}</p>
    </a>
    </div>
    <div class="side-game">
    <a href="/currentGame.html?gameId=${this.frontPageGames[2].gameId}">
      <img src=${this.frontPageGames[2].thumbnail} alt="Game 2" />
      <p>${this.frontPageGames[2].title}</p>
    </a>
    </div>
    <div class="side-game">
    <a href="/currentGame.html?gameId=${this.frontPageGames[4].gameId}">
      <img src=${this.frontPageGames[3].thumbnail} alt="Game 3" />
      <p>${this.frontPageGames[3].title}</p>
    </a>
    </div>
    <div class="side-game">
    <a href="/currentGame.html?gameId=${this.frontPageGames[4].gameId}">
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
      <a href="/currentGame.html?gameId=${this.saleGamesGame[0].gameId}">
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
      <a href="/currentGame.html?gameId=${this.saleGamesGame[1].gameId}">
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
      <a href="/currentGame.html?gameId=${this.saleGamesGame[2].gameId}">
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
      <a href="/currentGame.html?gameId=${this.saleGamesGame[3].gameId}">
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
      <a href="/currentGame.html?gameId=${this.saleGamesGame[4].gameId}">
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
      <a href="/currentGame.html?gameId=${this.saleGamesGame[5].gameId}">
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
      <a href="/currentGame.html?gameId=${this.saleGamesGame[6].gameId}">
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
      <a href="/currentGame.html?gameId=${this.saleGamesGame[7].gameId}">
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
  <!-- Browse All Games CTA -->
  <section class="browse-cta">
    <h2>Meer ontdekken?</h2>
    <p>Bekijk ons volledige aanbod aan games en deals.</p>
    <a href="/browse.html" class="browse-cta-button">Bekijk alle games</a>
  </section>
</div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "src/web/wwwroot/assets/css/welcome.css");

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
