/**
 * Represents a user
 */
export type UserResult = {
    userId: number;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    dob: string;
    gender: string;
    country?: string;
    profilePicture?: string;
    verified: boolean;
};

/**
 * Represents a welcome response
 */
export type WelcomeResponse = {
    message: string;
};

/**
 * Represents a game result.
 * Now sourced from Steam Store API + SteamSpy instead of CheapShark.
 */
export type GameResult = {
    /** The ID of the game (Steam App ID) */
    gameId: string;
    /** The Steam App ID (replaces cheapSharkGameId) */
    steamAppId: string;
    /** The SKU of the game (Steam App ID used as SKU) */
    SKU: string;
    /** The title of the game */
    title: string;
    /** The thumbnail / header image of the game */
    thumbnail: string;
    /** Screenshot URLs from the Steam store page */
    images: string[] | null;
    /** The short description of the game (plain text) */
    descriptionMarkdown: string;
    /** The detailed description of the game (HTML from Steam) */
    descriptionHtml: string;
    /** The URL to the Steam store page */
    url: string;
    /** The developers / publishers of the game */
    authors: string[] | null;
    /** Genre + tag labels */
    tags: string[] | null;
    /** Review summary strings */
    reviews: string[] | null;
};

/**
 * Extended game result with additional detail from Steam Store API + SteamSpy.
 * Used on the game detail page to show richer information.
 */
export type GameDetailResult = GameResult & {
    /** Steam rating text, e.g. "Very Positive" (derived from SteamSpy) */
    steamRatingText: string | null;
    /** Steam rating as a percentage, e.g. "92" (derived from SteamSpy) */
    steamRatingPercent: string | null;
    /** Number of Steam reviews (derived from SteamSpy positive + negative) */
    steamRatingCount: string | null;
    /** Metacritic score, e.g. "85" (from Steam Store API) */
    metacriticScore: string | null;
    /** Link to the Metacritic page (from Steam Store API) */
    metacriticLink: string | null;
    /** Release date as a Unix timestamp (from Steam Store API) */
    releaseDate: number | null;
    /** The cheapest price this game has ever been (null — not available without CheapShark/GG.deals) */
    cheapestPriceEver: {
        price: string;
        date: number;
    } | null;
    /** All current deals across different stores (null — Steam-only pricing) */
    storeDeals: StoreDeal[] | null;
};

/**
 * Represents a deal from a specific store for the game detail page.
 * Kept for backward compatibility — currently only Steam deals are populated.
 */
export type StoreDeal = {
    storeID: string;
    storeName: string;
    storeIcon: string;
    dealID: string;
    price: string;
    retailPrice: string;
    savings: string;
};

/**
 * Represents the user data when editing
 */
export type UserEditData = {
    userId: number;
    fname: string;
    lname: string;
    dob: string;
    gender: string;
    country: string;
};

/**
 * Represents a token
 */
export type TokenData = {
    token: string;
    userId: number;
    email: string;
    type: string;
};

/**
 * Represents a game license
 */
export type LicenseResult = {
    SKU: string;
    userId: number;
};

export type UserResponse = {
    user: UserResult;
};

/**
 * Represents the price of a product.
 * Now sourced from Steam Store API price_overview.
 */
export type ProductPrice = {
    /** Current (possibly discounted) price */
    price: number;
    /** The Steam App ID */
    productId: string;
    /** Currency code (e.g. "USD", "EUR") */
    currency: string;
    /** Original price before discount */
    normalPrice: number;
    /** Discount percentage as string (e.g. "25") */
    savings: string;
    /** Store identifier (always "steam" for now) */
    storeID: string;
};

export type GameWithPrices = {
    game: GameResult;
    prices: ProductPrice[];
};

export type SalePrices = {
    gameId: string;
    oldPrice: number;
    newPrice: number;
};

export type RegisterResult = {
    success: boolean;
    verifyUrl?: string;
    emailSent?: boolean;
};

// ============================================================
// Auth & session types
// ============================================================

export type LoginData = {
    email: string;
    password: string;
};

export type SessionResponse = {
    sessionId: string;
};

export type SecretResponse = {
    userId: number;
    sessionId: string;
};

export type UserRegisterData = {
    firstname: string;
    lastname: string;
    email: string;
    dob: string;
    gender: string;
    password: string;
    verificationToken: string | undefined;
    isVerified: boolean | undefined;
};
