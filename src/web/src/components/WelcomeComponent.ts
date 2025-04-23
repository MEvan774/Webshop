import { html } from "@web/helpers/webComponents";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class WelcomeComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
    }

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
  <div class="hero-main">
    <img src="public/assets/img/temp/Frontpage.png" alt="Featured Game" />
    <div class="hero-text">
      <h1>Kidnapped: castle breakout</h1>
      <button>Koop nu!</button>
    </div>
  </div>

  <!-- Right: Vertical list of other games -->
  <div class="hero-side-list">
    <div class="side-game">
      <img src="public/assets/img/temp/Frontpage.png" alt="Game 1" />
      <p>Game Title 1</p>
    </div>
    <div class="side-game">
      <img src="public/assets/img/temp/Frontpage.png" alt="Game 2" />
      <p>Game Title 2</p>
    </div>
    <div class="side-game">
      <img src="public/assets/img/temp/Frontpage.png" alt="Game 3" />
      <p>Game Title 3</p>
    </div>
    <div class="side-game">
      <img src="public/assets/img/temp/Frontpage.png" alt="Game 4" />
      <p>Game Title 4</p>
    </div>
  </div>
</section>

  <!-- Discover Row -->
  <section class="discover">
    <h2>Uitverkoop</h2>
    <p>Alle geweldige deals, in één plek!</p>
    <div class="scroll-section">
  <div class="scroll-arrow left" onclick="scrollGames('left')">
  <img src="public/assets/img/ui/Arrow.svg">
  </div>
    <div class="horizontal-scroll">
      <div class="game-card">
        <img src="public/assets/img/temp/Frontpage.png" alt="Game 1" />
        <p>Kidnapped: castle breakout</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
  <p class="discounted-price">€29.99</p>
</div>
        <div class="bottom">
        <img src="public/assets/img/ui/Bottom.svg">
        </div>
    </div>
      <div class="game-card">
        <img src="public/assets/img/temp/Frontpage.png" alt="Game 2" />
        <p>Game Title 2</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
  <p class="discounted-price">€29.99</p>
</div>
        <div class="bottom">
        <img src="public/assets/img/ui/Bottom.svg">
        </div>
      </div>
      <div class="game-card">
        <img src="public/assets/img/temp/Frontpage.png" alt="Game 2" />
        <p>Game Title 2</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
  <p class="discounted-price">€29.99</p>
</div>
        <div class="bottom">
        <img src="public/assets/img/ui/Bottom.svg">
        </div>
      </div>
      <div class="game-card">
        <img src="public/assets/img/temp/Frontpage.png" alt="Game 2" />
        <p>Game Title 2</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
  <p class="discounted-price">€29.99</p>
</div>
        <div class="bottom">
        <img src="public/assets/img/ui/Bottom.svg">
        </div>
      </div>
      <div class="game-card">
        <img src="public/assets/img/temp/Frontpage.png" alt="Game 2" />
        <p>Game Title 2</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
            <p class="discounted-price">€29.99</p>
            </div>
        <div class="bottom">
        <img src="public/assets/img/ui/Bottom.svg">
        </div>
    </div>
    <div class="game-card">
        <img src="public/assets/img/temp/Frontpage.png" alt="Game 2" />
        <p>Game Title 2</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
            <p class="discounted-price">€29.99</p>
            </div>
        <div class="bottom">
        <img src="public/assets/img/ui/Bottom.svg">
        </div>
    </div>
    <!-- Add more cards -->
</div>
<div class="scroll-arrow right" onclick="scrollGames('right')">
    <img src="public/assets/img/ui/Arrow.svg">
</div>
</div>
</section>
</div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/welcome.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);
    }
}

window.customElements.define("webshop-welcome", WelcomeComponent);
