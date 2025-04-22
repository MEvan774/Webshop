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

export type GameResult = {
    /** ID of the game */
    gameID: number;
    /** SKU of the game */
    SKU: string;
    /** Title of the game */
    title: string;
    /** Thumbnail of the game */
    thumbnail: string[];
    /** Other images of the game */
    images: string[];
    /** The markdown of the game description */
    descriptionMarkdown: string;
    /** The HTML of the game description */
    descriptionHtml: string;
    /** The URL of the game */
    url: string;
    /** The authors of the game */
    authors: string[];
    /** The tags of the game */
    tags: string[];
    /** The reviews of the game */
    reviews: string[];
};
