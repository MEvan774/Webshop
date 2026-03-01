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
 * Represents a game result
 */
export type GameResult = {
    /** The ID of the game */
    gameId: string;
    /** The CheapShark game ID */
    cheapSharkGameId: string;
    /** The SKU/dealID of the game */
    SKU: string;
    /** The title of the game */
    title: string;
    /** The thumbnail of the game */
    thumbnail: string;
    /** The images of the game */
    images: string[] | null;
    /** The description of the game in markdown */
    descriptionMarkdown: string;
    /** The description of the game in html */
    descriptionHtml: string;
    /** The URL to the store page */
    url: string;
    /** The authors/developers of the game */
    authors: string[] | null;
    /** The tags of the game */
    tags: string[] | null;
    /** The reviews of the game */
    reviews: string[] | null;
};

/**
 * Extended game result with additional detail from CheapShark.
 * Used on the game detail page to show richer information.
 */
export type GameDetailResult = GameResult & {
    /** Steam rating text, e.g. "Very Positive" */
    steamRatingText: string | null;
    /** Steam rating as a percentage, e.g. "92" */
    steamRatingPercent: string | null;
    /** Number of Steam reviews */
    steamRatingCount: string | null;
    /** Metacritic score, e.g. "85" */
    metacriticScore: string | null;
    /** Link to the Metacritic page */
    metacriticLink: string | null;
    /** Release date as a Unix timestamp */
    releaseDate: number | null;
    /** The cheapest price this game has ever been */
    cheapestPriceEver: {
        price: string;
        date: number;
    } | null;
    /** All current deals across different stores */
    storeDeals: StoreDeal[] | null;
};

/**
 * Represents a deal from a specific store for the game detail page
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
 * Respresents a game license
 */
export type LicenseResult = {
    SKU: string;
    userId: number;
};

export type UserResponse = {
    user: UserResult;
};

export type ProductPrice = {
    price: number;
    productId: string;
    currency: string;
    normalPrice: number;
    savings: string;
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

/**
 * Represents a deal from CheapShark API
 * This replaces the old GameResult + ProductPrice combo
 */
export type CheapSharkDeal = {
    internalName: string;
    title: string;
    metacriticLink: string | null;
    dealID: string;
    storeID: string;
    gameID: string;
    salePrice: string;
    normalPrice: string;
    isOnSale: string;
    savings: string;
    metacriticScore: string;
    steamRatingText: string | null;
    steamRatingPercent: string;
    steamRatingCount: string;
    steamAppID: string | null;
    releaseDate: number;
    lastChange: number;
    dealRating: string;
    thumb: string;
};

/**
 * Represents the detailed response from CheapShark /deals?id={dealID}
 */
export type CheapSharkDealDetail = {
    gameInfo: {
        storeID: string;
        gameID: string;
        name: string;
        steamAppID: string | null;
        salePrice: string;
        retailPrice: string;
        steamRatingText: string | null;
        steamRatingPercent: string;
        steamRatingCount: string;
        metacriticScore: string;
        metacriticLink: string | null;
        releaseDate: number;
        publisher: string | null;
        steamworks: string | null;
        thumb: string;
    };
    cheaperStores: {
        dealID: string;
        storeID: string;
        salePrice: string;
        retailPrice: string;
    }[];
    cheapestPrice: {
        price: string;
        date: number;
    };
};

/**
 * Represents a game from CheapShark /games?id={id} endpoint
 */
export type CheapSharkGameDetail = {
    info: {
        title: string;
        steamAppID: string | null;
        thumb: string;
    };
    cheapestPriceEver: {
        price: string;
        date: number;
    };
    deals: CheapSharkGameDeal[];
};

/**
 * Represents a single deal inside a game detail response
 */
export type CheapSharkGameDeal = {
    storeID: string;
    dealID: string;
    price: string;
    retailPrice: string;
    savings: string;
};

/**
 * Represents a game from CheapShark /games?title={title} search
 */
export type CheapSharkGameSearch = {
    gameID: string;
    steamAppID: string | null;
    cheapest: string;
    cheapestDealID: string;
    external: string; // game title
    internalName: string;
    thumb: string;
};

/**
 * Represents a store from CheapShark /stores endpoint
 */
export type CheapSharkStore = {
    storeID: string;
    storeName: string;
    isActive: number;
    images: {
        banner: string;
        logo: string;
        icon: string;
    };
};

// Add these missing types:
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
