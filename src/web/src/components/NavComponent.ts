import { html } from "@web/helpers/webComponents";

export class NavComponent extends HTMLElement {
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
    <input type="text" placeholder="Zoek game..." />
</div>
    </div>
            <div class="navbar-right">
              <a href="/register.html">Registreren</a>
              <a href="/login.html">Inloggen</a>
            </div>
    </div>
</div>
        `;

        const styleLink: HTMLLinkElement = document.createElement("link");
        styleLink.setAttribute("rel", "stylesheet");
        styleLink.setAttribute("href", "/assets/css/navbar.css");

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
        this.shadowRoot.appendChild(styleLink);
    }
}

window.customElements.define("nav-bar", NavComponent);
