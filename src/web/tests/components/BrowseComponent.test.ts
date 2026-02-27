import { beforeEach, describe, expect, test, vi } from "vitest";
import { deepQuerySelector, deepQuerySelectorAll } from "../__helpers__/web.helpers";

import { GameResult } from "@shared/types";
import { BrowseComponent } from "@web/components/BrowseComponent";

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("BrowseComponent", () => {
    test("should render loading skeleton initially", () => {
        // Arrange
        const component: BrowseComponent = new BrowseComponent();
        document.body.append(component);

        const skeletonCards: HTMLElement[] = deepQuerySelectorAll(document, ".browse-card.skeleton");

        // Act / Assert
        expect(skeletonCards.length).toBeGreaterThan(0);
    });

    test("should render the page header", () => {
        // Arrange
        const component: BrowseComponent = new BrowseComponent();
        document.body.append(component);

        const header: HTMLElement = deepQuerySelector(document, ".browse-header h1")!;

        // Act / Assert
        expect(header.innerHTML.trim()).toEqual("Alle Games");
    });

    test("should render game cards after loading", async () => {
        // Arrange
        const mockGames: GameResult[] = [
            {
                gameId: "1",
                cheapSharkGameId: "1",
                SKU: "deal1",
                title: "Test Game",
                thumbnail: "https://example.com/thumb.jpg",
                images: null,
                descriptionMarkdown: "",
                descriptionHtml: "",
                url: "",
                authors: null,
                tags: null,
                reviews: null,
            },
        ];

        fetchMock.mockResponse((request: Request) => {
            if (request.url.includes("/products")) {
                return {
                    status: 200,
                    body: JSON.stringify(mockGames),
                };
            }

            if (request.url.includes("/products/prices")) {
                return {
                    status: 200,
                    body: JSON.stringify({
                        1: {
                            price: 29.99,
                            productId: "1",
                            currency: "USD",
                            normalPrice: 29.99,
                            savings: "0",
                            storeID: "1",
                        },
                    }),
                };
            }

            throw new Error("Unknown request");
        });

        const component: BrowseComponent = new BrowseComponent();
        document.body.append(component);

        // Wait for async loading
        await new Promise(resolve => setTimeout(resolve, 100));

        const gameCards: HTMLElement[] = deepQuerySelectorAll(document, ".browse-card");

        // Act / Assert
        expect(gameCards.length).toBeGreaterThan(0);
    });
});
