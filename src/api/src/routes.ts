import { Router } from "express";
import { WelcomeController } from "./controllers/WelcomeController";
import { requireValidSessionMiddleware, sessionMiddleware } from "./middleware/sessionMiddleware";
import { UserController } from "./controllers/UserController";
import { GamesController } from "./controllers/GamesController";
import { getGameWithGameID } from "./services/CurrentGameService";
import { GameResult, TokenData, UserResult } from "@shared/types";
import { checkEmail, getUser } from "./services/ProfileService";
import { changePassword } from "./services/ProfileService";
import { TokenController } from "./controllers/TokenController";
import { LicenseController } from "./controllers/LicenseController";
import { CurrentGameController } from "./controllers/CurrentGameController";
import { UserService } from "./services/UserService";

// Create a router
export const router: Router = Router();

// Setup endpoints
router.get("/", (_, res) => {
    res.send("Welcome to the API!");
});

// Forward endpoints to other routers
const welcomeController: WelcomeController = new WelcomeController();
const userController: UserController = new UserController();
const gamesController: GamesController = new GamesController();
const tokenController: TokenController = new TokenController();
const licenseController: LicenseController = new LicenseController();
const currentGameController: CurrentGameController = new CurrentGameController();

// Check token after clicking link
router.get("/token/:token", async (req, res) => {
    const { token } = req.params;

    const TokenData: TokenData | undefined = await tokenController.checkToken(token);

    if (!TokenData) {
        return res.status(404).json({ error: "Game not found" });
    }

    return res.json(TokenData);
});

// Change the email of the user
router.post("/user/change-email", async (req, res) => await userController.changeEmail(req, res));
const userService: UserService = new UserService();

// Cancel the change the email of the user
router.post("/user/cancel-email", async (req, res) => await userController.cancelEmail(req, res));

// Get current game
router.get("/games/:gameID", async (req, res) => {
    const { gameID } = req.params;

    try {
        // Call the service function to get the game data
        const game: GameResult | null = await getGameWithGameID(gameID);

        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }

        // Respond with the game data
        return res.json(game);
    }
    catch (error) {
        console.error("Error fetching game:", error);
        return res.status(500).json({ error: "An error occurred while fetching the game." });
    }
});

// Get the user by the sessionID
router.get("/user/:sessionID", async (req, res) => {
    const { sessionID } = req.params;

    try {
        // Call the service function to get the game data
        const user: UserResult | undefined = await getUser(sessionID);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Respond with the user data
        return res.json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: "An error occurred while fetching the user." });
    }
});

router.get("/products", (req, res) => gamesController.getAllGames(req, res));

// NOTE: After this line, all endpoints will check for a session.
router.use(sessionMiddleware);

router.get("/session", (req, res) => welcomeController.getSession(req, res));
router.delete("/session", (req, res) => welcomeController.deleteSession(req, res));
router.delete("/session/expired", (req, res) => welcomeController.deleteExpiredSessions(req, res));
router.get("/welcome", (req, res) => welcomeController.getWelcome(req, res));

router.post("/user/register", (req, res) => userController.registerUser(req, res));
router.get("/user/exists/:email", (req, res) => userController.getUserByEmail(req, res));
router.post("/user/login", (req, res) => userController.loginUser(req, res));

router.get("/verify", async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ error: "Geen verificatietoken gevonden." });
    }

    try {
        const isVerified: boolean = await userService.verifyUser(token as string);

        if (isVerified) {
            return res.status(200).json({ message: "Je account is succesvol geverifieerd!" });
        }
        else {
            return res.status(400).json({ error: "Ongeldig of verlopen verificatietoken." });
        }
    }
    catch (error: unknown) {
        if (error instanceof Error && error.message === "Uw account is reeds geverifieerd.") {
            return res.status(400).json({ error: "Uw account is reeds geverifieerd." });
        }
        console.error("Verificatie mislukt:", error);
        return res.status(500).json({ error: "Fout bij het verifiëren van de gebruiker." });
    }
});

// NOTE: After this line, all endpoints will require a valid session.
router.use(requireValidSessionMiddleware);

router.get("/secret", (req, res) => welcomeController.getSecret(req, res));
router.delete("/user/logout", (req, res) => userController.logoutUser(req, res));

// TODO: The following endpoints have to be implemented in their own respective controller
router.get("/products/:id", (_req, _res) => {
    throw new Error("Return a specific product");
});

router.post("/cart/add", (_req, _res) => {
    throw new Error("Add a product to the cart");
});

router.get("/cart", (_req, _res) => {
    throw new Error("Return a list of products in the cart and the total price");
});

// Get all users
router.get("/user", (req, res) => userController.getData(req, res));

// Change the password
router.post("/user/change-password", async (req, res) => await changePassword(req, res));

// Check if the email is used
router.get("/user/check-email/:email", async (req, res) => {
    const { email } = req.params;
    try {
        // Call the service function to get the game data
        const emailFree: boolean = await checkEmail(email);

        // Respond with the game data
        return res.json(emailFree);
    }
    catch (error) {
        console.error("Email not free:", error);
        return res.status(500).json({ error: "An error occurred while checking the email." });
    }
});

// Edit the user information
router.post("/user/edit", async (req, res) => await userController.editUser(req, res));

// Save the token in the database
router.post("/token", async (req, res) => tokenController.createToken(req, res));

// Get the licenses the user owns with the userId
router.get("/license/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        await licenseController.getLicensesByUser(userId, res);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error:", error });
    }
});

// Get the game with the given SKU
router.get("/gamesSKU/:SKU", async (req, res) => {
    try {
        const { SKU } = req.params;
        await currentGameController.getGameBySKU(SKU, res);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error:", error });
    }
});

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (!cookieHeader) return cookies;

    cookieHeader.split(";").forEach(cookie => {
        const [name, ...rest] = cookie.trim().split("=");
        cookies[name] = decodeURIComponent(rest.join("="));
    });

    return cookies;
}

router.get("/profile", async (req, res) => {
    const cookies: Record<string, string> = parseCookies(req.headers.cookie);
    const sessionId: string = cookies.session;

    if (!sessionId) {
        return res.status(401).json({ message: "No session found" });
    }

    const user: UserResult | undefined = await getUser(sessionId);
    return res.status(200).json({ user });
});
