import { IOegeDockerService } from "@api/interfaces/IOegeDockerService";

export class OegeDockerService extends IOegeDockerService {
    private buildURL(port: number, path: string): string {
        return `http://oege.ie.hva.nl:${port}/${path}`;
    }

    public async connectAPI<T>(port: number, path: string): Promise<T> {
        const apiURL: string = this.buildURL(port, path);

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        const response: Response = await fetch(apiURL, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        return (await response.json()) as T;
    }
}
