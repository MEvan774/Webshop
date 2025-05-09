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
    /** ID of the game */
    gameID: number;
    /** SKU of the game */
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
    /** The URL of the game */
    url: string;
    /** The authors of the game */
    authors: string[] | null;
    /** The tags of the game */
    tags: string[] | null;
    /** The reviews of the game */
    reviews: string[] | null;
};

export type UserEditData = {
    userId: number;
    fname: string;
    lname: string;
    dob: string;
    gender: string;
    country: string;
};
