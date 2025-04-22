import "@web/components/NavigationComponent";
import "@web/components/WelcomeComponent";
import { WebshopEvent } from "@web/enums/WebshopEvent";

import { html } from "@web/helpers/webComponents";
import { WebshopEventService } from "@web/services/WebshopEventService";

export class IndexPageComponent extends HTMLElement {
    private _webshopEventService: WebshopEventService = new WebshopEventService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // NOTE: This is just an example event, remove it!
        this._webshopEventService.addEventListener<string>(WebshopEvent.Welcome, message => {
            console.log(`Welcome event triggered: ${message}`);
        });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <div>
            <div class="navbar">
            <div class="navbar-left">
    <!-- logo or brand -->
    <a href="index.html" class="brand-link">
    <img class="logo" src="/assets/img/icons/LogoIcon.png" />
    <div class="brand">
    <p class="brand-name">LucaStarShop</p>
    <p class="brand-tagline">De shop voor de sterren in gaming!</p>
</div>
</a>

  </div>
                <div class="navbar-center">
  <div class="searchbar">
    <button>
      <img src="/assets/img/icons/SearchIcon.png" alt="Search" />
    </button>
    <input type="text" placeholder="Search..." />
  </div>
  </div>
              <div class="navbar-right">
              <button class="login-button">Login</button>
            </div>
</div>

<div class="frontpage">
  <!-- Hero Banner -->
   <h1>Aanbevolen</h1>
   <p>ontdek onze sterren!</p>
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
  <div class="scroll-arrow left" onclick="scrollGames('left')">&#8592;</div>
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
        <img src="public/assets/img/ui/Bottom.png">
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
        <img src="public/assets/img/ui/Bottom.png">
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
        <img src="public/assets/img/ui/Bottom.png">
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
        <img src="public/assets/img/ui/Bottom.png">
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
        <img src="public/assets/img/ui/Bottom.png">
        </div>
    </div>
    <!-- Add more cards -->
</div>
<div class="scroll-arrow right" onclick="scrollGames('right')">&#8594;</div>
</div>
  </section>

  <!-- Game Grid -->
   <!--
  <section class="game-grid">
    <h2>Releases</h2>
    <div class="game-card">
        <img src="public/assets/img/temp/Frontpage.png" alt="Game 2" />
        <p>Game Title 2</p>
        <div class="price-wrapper">
            <p class="discount">25%</p>
            <p class="original-price">€49.99</p>
            <p class="discounted-price">€29.99</p>
            </div>
        <div class="bottom">
        <img src="public/assets/img/ui/Bottom.png">
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
        <img src="public/assets/img/ui/Bottom.png">
        </div>
      </div>
    -->
      <!-- Add more tiles -->
    </section>
    </div>
</div>

                <webshop-navigation></webshop-navigation>

                <div>
                    <h1>
                        Welkom bij de LucaStars Webshop!
                    </h1>

                    <webshop-welcome></webshop-welcome>
                </div>
            </div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/navbar.css");

        const stylePage: HTMLLinkElement = document.createElement("link");
        stylePage.setAttribute("rel", "stylesheet");
        stylePage.setAttribute("href", "/assets/css/landingPage.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);
        this.shadowRoot.appendChild(stylePage);
    }
}

window.customElements.define("webshop-page-index", IndexPageComponent);
