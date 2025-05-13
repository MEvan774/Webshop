import { UserResult } from "@shared/types";
import { getUser } from "@web/services/ProfileService";

/**
 * Class for the parent of all profile components, extends HTMLElement
 */
export abstract class BaseProfileComponent extends HTMLElement {
    protected user: UserResult | null = null;

    /**
     * Attach the Shadow, get the current user and render the HTML
     */
    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        this.user = await this.getCurrentUser();
        await this.render();
    }

    /**
     * Get the current user
     *
     * @returns Current user as UserResult, or null if no user is found
     */
    protected async getCurrentUser(): Promise<UserResult | null> {
        return await getUser();
    }

    /**
     * Make custom events for buttons
     *
     * @param buttonID ID of the button the event needs to be added to in string
     * @param eventName Name of the event as string
     * @param method Method that happens when clicking on the button as K, can be ignored
     */
    protected setButtonEvents<K extends keyof this>(buttonID: string, eventName: string, method?: K): void {
        const button: HTMLButtonElement | null | undefined = this.shadowRoot?.querySelector(`#${buttonID}`);

        if (button) {
            button.addEventListener("click", () => {
                this.dispatchEvent(new CustomEvent(eventName, { bubbles: true }));

                if (method) {
                    const methodRef: unknown = this[method] as unknown;

                    if (typeof methodRef === "function") {
                        (methodRef as () => void).call(this);
                    }
                }
            });
        }
    }

    protected abstract render(): Promise<void>;
}
