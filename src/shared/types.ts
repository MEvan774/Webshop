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

/**
 * Represents the user data
 */
export type UserResult = {
    userId: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    dob: string;
    gender: string;
    country: string | null;
    profilePicture: string | null;
    isVerified: boolean;
};

/**
 * Represents the user register data
 */
export type UserRegisterData = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    dob: string;
    gender: string;
    verificationToken: string | undefined;
    isVerified: boolean | undefined;
};

/**
 * Represents data given to user on registration
 */
export type UserRegistrationResponse = {
    message: string;
    userId: string;
    verificationToken: string;
    isVerified: boolean | undefined;
};

/**
 * Represents the login data
 */
export type LoginData = {
    email: string;
    password: string;
};

/**
 * Represents a game
 */
export type GameResult = {
    /** Deal ID from CheapShark (replaces old gameId) */
    gameId: string;
    /** Internal game ID from CheapShark */
    cheapSharkGameId: string;
    /** SKU - using dealID as unique identifier */
    SKU: string;
    /** Title of the game */
    title: string;
    /** Thumbnail of the game */
    thumbnail: string;
    /** Other images of the game */
    images: string[] | null;
    /** The markdown of the game description */
    descriptionMarkdown: string;
    /** The HTML of the game description */
    descriptionHtml: string;
    /** The URL of the game (link to deal on store) */
    url: string;
    /** The authors/developers of the game */
    authors: string[] | null;
    /** The tags of the game */
    tags: string[] | null;
    /** The reviews of the game */
    reviews: string[] | null;
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
