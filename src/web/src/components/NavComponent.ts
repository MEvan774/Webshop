/* Deze navigatiebalk component wordt niet gebruikt in het project. Om toekomstige verwarringen met mergen te voorkomen, refereert dit document naar andere documenten waarin "remove_me!" in de naam staat. */

import { html } from "@web/helpers/webComponents";

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

            // if () {
            //     element = html`
            //     <nav>
            //         <style>${elementStyle}</style>
            //         <a id="big-logo" href="index.html">
            //             <div id="logo">
            //                 <img src="/assets/img/logo_simple.png" alt="LucaStars Logo">
            //                 <h1>LucaStarShop</h1>
            //             </div>
            //             <p>De shop voor sterren in gaming!</p>
            //         </a>
            //         <div id="search-bar">
            //             <label>
            //                 <input type="text">
            //             </label>
            //         </div>
            //         <div id="button-container">

            //         </div>
            //     </nav>
            //     `;
            // }
            // else {
            const element: HTMLElement = html`
                <nav>
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
                        <a><span class="material-symbols-outlined">person</span></a>
                        <a><span class="material-symbols-outlined">favorite</span></a>
                        <a><span class="material-symbols-outlined">shopping_cart</span></a>
                    </div>
                </nav>
                `;
            // }

            const styleLink: HTMLLinkElement = document.createElement("link");
            styleLink.setAttribute("rel", "stylesheet");
            styleLink.setAttribute("href", "/assets/css/nav(remove_me!).css");

            this.shadowRoot.firstChild?.remove();
            this.shadowRoot.append(element);
            this.shadowRoot.appendChild(styleLink);
        }
        catch (error) {
            console.error(error);
        }
    }
}

window.customElements.define("nav-bar", NavComponent);
