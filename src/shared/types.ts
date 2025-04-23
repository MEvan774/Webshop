/**
 * Represents a session
 */
export type SessionResponse = {
    /** ID of the session */
    sessionId: string;
};

/**
 * Represents a welcome message
 */
export type WelcomeResponse = {
    /** Contents of the welcome message */
    message: string;
};

/**
 * Represents a secret message
 */
export type SecretResponse = {
    /** ID of the session */
    sessionId: string;
    /** ID of the user */
    userId: string;
};

export type GamesData = {
    gameId: number;
    SKU: string;
    title: string;
    thumbnail: string;
    images: string;
    descriptionMarkdown: string;
    descriptionHtml: string;
    url: string;
    authors: string;
    tags: string;
    reviews: string;
    discount?: string;
    originalPrice: number;
    discountedPrice: number;
};
