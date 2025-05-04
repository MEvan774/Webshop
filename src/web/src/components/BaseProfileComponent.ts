import { UserResult } from "@shared/types";
import { getUser } from "@web/services/ProfileService";

export abstract class BaseProfileComponent extends HTMLElement {
    protected user: UserResult | null = null;

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        this.user = await this.getCurrentUser();
        await this.render();
    }

    protected async getCurrentUser(): Promise<UserResult | null> {
        return await getUser();
    }

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
