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
