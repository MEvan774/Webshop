import { WebshopEvent } from "@web/enums/WebshopEvent";
import { GameResult } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { WebshopEventService } from "@web/services/WebshopEventService";
import { WelcomeService } from "@web/services/WelcomeService";
import { getAllGames } from "@web/services/AllGamesService copy";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class WelcomeComponent extends HTMLElement {
    private _webshopEventService: WebshopEventService = new WebshopEventService();
    private _welcomeService: WelcomeService = new WelcomeService();

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        await this.addGames();
        this.render();
    }

    private async addGames(): Promise <void> {
        const games: GameResult[] | null = await this.getAllGames();

        // Filter games into the correct arrays
        if (!games)
            return;

        this.frontPageGames = [games[36], games[3], games[5], games[40], games[41]];
        this.saleGames = [games[12], games[11], games[8], games[7], games[9], games[15], games[19], games[20]];
    }

    private frontPageGames: GameResult[] | undefined;
    private saleGames: GameResult[] | undefined;

    // private welcomeService: WelcomeService = new WelcomeService();

    private async getAllGames(): Promise<GameResult[] | null> {
        return await getAllGames();
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
    <img src=${this.frontPageGames![0].thumbnail} alt="Featured Game" />
    <div class="hero-text">
      <h1>${this.frontPageGames![0].title}</h1>
      <button>Koop nu!</button>
    </div>
  </div>

  <!-- Right: Vertical list of other games -->
  <div class="hero-side-list">
    <div class="side-game">
      <img src=${this.frontPageGames![1].thumbnail} alt="Game 1" />
      <p>${this.frontPageGames![1].title}</p>
    </div>
    <div class="side-game">
      <img src=${this.frontPageGames![2].thumbnail} alt="Game 2" />
      <p>${this.frontPageGames![2].title}</p>
    </div>
    <div class="side-game">
      <img src=${this.frontPageGames![3].thumbnail} alt="Game 3" />
      <p>${this.frontPageGames![3].title}</p>
    </div>
    <div class="side-game">
      <img src=${this.frontPageGames![4].thumbnail} alt="Game 4" />
      <p>${this.frontPageGames![4].title}</p>
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
        <img src= ${this.saleGames![0].thumbnail} alt="Game 1" />
        <p>${this.saleGames![0].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
  <p class="discounted-price">€29.99</p>
</div>
        <div class="bottom">
        <img src="assets/img/ui/Bottom.svg">
        </div>
    </div>
      <div class="game-card">
        <img src=${this.saleGames![1].thumbnail} alt="Game 2" />
        <p>${this.saleGames![1].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
  <p class="discounted-price">€29.99</p>
</div>
        <div class="bottom">
        <img src="assets/img/ui/Bottom.svg">
        </div>
      </div>
      <div class="game-card">
        <img src=${this.saleGames![2].thumbnail} alt="Game 2" />
        <p>${this.saleGames![2].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
  <p class="discounted-price">€29.99</p>
</div>
        <div class="bottom">
        <img src="assets/img/ui/Bottom.svg">
        </div>
      </div>
      <div class="game-card">
        <img src=${this.saleGames![3].thumbnail} alt="Game 2" />
        <p>${this.saleGames![3].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
  <p class="discounted-price">€29.99</p>
</div>
        <div class="bottom">
        <img src="assets/img/ui/Bottom.svg">
        </div>
      </div>
      <div class="game-card">
        <img src=${this.saleGames![4].thumbnail} alt="Game 2" />
        <p>${this.saleGames![4].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
            <p class="discounted-price">€29.99</p>
            </div>
        <div class="bottom">
        <img src="assets/img/ui/Bottom.svg">
        </div>
    </div>
    <div class="game-card">
        <img src=${this.saleGames![5].thumbnail} alt="Game 2" />
        <p>${this.saleGames![5].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
            <p class="discounted-price">€29.99</p>
            </div>
        <div class="bottom">
        <img src="assets/img/ui/Bottom.svg">
        </div>
    </div>
    <div class="game-card">
        <img src=${this.saleGames![6].thumbnail} alt="Game 2" />
        <p>${this.saleGames![6].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
            <p class="discounted-price">€29.99</p>
            </div>
        <div class="bottom">
        <img src="assets/img/ui/Bottom.svg">
        </div>
    </div>
    <div class="game-card">
        <img src=${this.saleGames![7].thumbnail} alt="Game 2" />
        <p>${this.saleGames![7].title}</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
            <p class="discounted-price">€29.99</p>
            </div>
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

        const resultElement: HTMLElement = element.querySelector("#result")!;
        const createSessionButtonElement: HTMLElement = element.querySelector("#create-session-button")!;
        const deleteSessionButtonElement: HTMLElement = element.querySelector("#delete-session-button")!;
        const publicTextButtonElement: HTMLElement = element.querySelector("#public-text-button")!;
        const secretTextButtonElement: HTMLElement = element.querySelector("#secret-text-button")!;

        createSessionButtonElement.addEventListener("click", async () => {
            const sessionId: string = await this._welcomeService.getSession();

            resultElement.innerHTML = `Je hebt nu een session-cookie met de volgende ID: ${sessionId}`;
        });

        deleteSessionButtonElement.addEventListener("click", async () => {
            await this._welcomeService.deleteSession();

            resultElement.innerHTML = "Je sessie is nu ongeldig!";
        });

        publicTextButtonElement.addEventListener("click", async () => {
            const welcomeText: string = await this._welcomeService.getWelcome();

            this._webshopEventService.dispatchEvent<string>(WebshopEvent.Welcome, welcomeText);

            resultElement.innerHTML = welcomeText;
        });

        secretTextButtonElement.addEventListener("click", async () => {
            const secretText: string = await this._welcomeService.getSecret();

            resultElement.innerHTML = secretText;
        });

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

        const heroMain: HTMLElement = this.shadowRoot.querySelector("#hero-main") as HTMLElement;
        heroMain.addEventListener("click", () => {
            localStorage.setItem("gameID", "37");
            window.location.href = "/currentGame.html";
        });

        this.shadowRoot.appendChild(styleLink);
    }
}
window.customElements.define("webshop-welcome", WelcomeComponent);
