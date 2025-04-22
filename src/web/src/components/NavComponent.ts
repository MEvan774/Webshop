import { html, css } from "@web/helpers/webComponents";

export class NavComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    public render(): void {
        try {
            if (!this.shadowRoot) {
                throw new Error("No ShadowRoot");
            }

            const elementStyle: string = css`
            :root {
                --white: #FFFAF0;
                --blue: #1C2594;
                --black: #1B1212;
                --light-blue: #7883CE;
                --blue-gradient: linear-gradient(90deg, rgba(28, 37, 148, 1) 0%, rgba(91, 202, 243, 1) 100%);
            }

            .material-symbols-outlined {
                 font-variation-settings:
                         'FILL' 0,
                         'wght' 400,
                         'GRAD' 0,
                         'opsz' 24
            }

            .pacifico-regular {
                font-family: "Pacifico", cursive;
                font-weight: 400;
                font-style: normal;
            }

            html, body {
                margin: 0;
                padding: 0;
                font-family: Pacifico, cursive;
                color: var(--white);
            }

            nav {
                display: flex;
                flex-grow: 1;
                justify-content: space-between;
                align-items: center;
                background: var(--blue-gradient);
            }

            #big-logo, #logo {
                margin: 0;
            }

            #big-logo {
                margin-left: 20px;
                text-decoration: none;
                color: var(--white);
            }

            #logo {
                display: flex;
                gap: 5px;
            }

            #logo h1 {
                margin: 0;
                font-size: 45px;
            }

            #logo img {
                width: 38px;
                height: 64px;
            }

            #search-bar {
                position: relative;
            }

            #search-bar input {
                font-family: "Raleway", sans-serif;
                width: 525px;
                height: 50px;
                border-radius: 10px;
                background-image: url("/assets/img/search_icon.png");
                background-repeat: no-repeat;
                background-position: 6px center;
                padding-left: 40px;
                font-size: 28px;
            }

            #button-container {
                margin-right: 20px;
            }

            #button-container > button {
                width: 167px;
                height: 50px;
                font-size: 26px;
                border-radius: 2px;
                background-color: var(--white);
                font-family: "Raleway", sans-serif;
            }
            `;

            const element: HTMLElement = html`
            <nav>
                <style>${elementStyle}</style>
                <a id="big-logo" href="index.html">
                    <div id="logo">
                        <img src="/assets/img/logo_simple.png" alt="LucaStars Logo">
                        <h1>LucaStarShop</h1>
                    </div>
                    <p>De shop voor sterren in gaming!</p>
                </a>
                <div id="search-bar">
                    <label>
                        <input type="text">
                    </label>
                </div>
                <div id="button-container">
                    <button>Login</button>
                </div>
            </nav>
            `;

            this.shadowRoot.firstChild?.remove();
            this.shadowRoot.append(element);
        }
        catch (error) {
            console.error(error);
        }
    }
}

window.customElements.define("nav-bar", NavComponent);
