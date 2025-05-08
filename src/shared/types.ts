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
};

export type UserRegisterData = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    dob: string;
    gender: string;
};

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
