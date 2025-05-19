// import { GameResult } from "@shared/types";
import { html } from "@web/helpers/webComponents";
// import { WelcomeService } from "@web/services/WelcomeService";
// import { GamesService } from "@web/services/GamesService";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class WelcomeComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        // console.log(this.getAllGames());
        this.render();
    }

    /*
    private welcomeService: WelcomeService = new WelcomeService();

    private async getAllGames(): Promise<GameResult[] | null> {
        return await this.welcomeService.getAllGames();
    }
*/

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
    <img src="assets/img/temp/BrightPage.png" alt="Featured Game" />
    <div class="hero-text">
      <h1>Kidnapped: Castle Breakout</h1>
      <button>Koop nu!</button>
    </div>
  </div>

  <!-- Right: Vertical list of other games -->
  <div class="hero-side-list">
    <div class="side-game">
      <img src="assets/img/temp/Frontpage.png" alt="Game 1" />
      <p>Game Title 1</p>
    </div>
    <div class="side-game">
      <img src="assets/img/temp/Frontpage.png" alt="Game 2" />
      <p>Game Title 2</p>
    </div>
    <div class="side-game">
      <img src="assets/img/temp/Frontpage.png" alt="Game 3" />
      <p>Game Title 3</p>
    </div>
    <div class="side-game">
      <img src="assets/img/temp/Frontpage.png" alt="Game 4" />
      <p>Game Title 4</p>
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
        <img src="assets/img/temp/Frontpage.png" alt="Game 1" />
        <p>Kidnapped: castle breakout</p>
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
        <img src="assets/img/temp/Frontpage.png" alt="Game 2" />
        <p>Game Title 2</p>
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
        <img src="assets/img/temp/Frontpage.png" alt="Game 2" />
        <p>Game Title 2</p>
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
        <img src="assets/img/temp/Frontpage.png" alt="Game 2" />
        <p>Game Title 2</p>
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
        <img src="assets/img/temp/Frontpage.png" alt="Game 2" />
        <p>Game Title 2</p>
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
        <img src="assets/img/temp/Frontpage.png" alt="Game 2" />
        <p>Game Title 2</p>
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
        <img src="assets/img/temp/Frontpage.png" alt="Game 2" />
        <p>Game Title 2</p>
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
        <img src="assets/img/temp/Frontpage.png" alt="Game 2" />
        <p>Game Title 2</p>
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

        const heroMain: HTMLElement = this.shadowRoot.querySelector("#hero-main") as HTMLElement;
        heroMain.addEventListener("click", () => {
            localStorage.setItem("gameID", "37");
            window.location.href = "/currentGame.html";
        });

        this.shadowRoot.appendChild(styleLink);
    }
}
window.customElements.define("webshop-welcome", WelcomeComponent);
