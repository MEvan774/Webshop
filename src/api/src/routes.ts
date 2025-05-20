import { Router } from "express";
import { WelcomeController } from "./controllers/WelcomeController";
import { requireValidSessionMiddleware, sessionMiddleware } from "./middleware/sessionMiddleware";
import { UserController } from "./controllers/UserController";
import { GamesController } from "./controllers/GamesController";
import { getGameWithGameID } from "./services/CurrentGameService";
import { GameResult } from "@shared/types";
import { UserService } from "./services/UserService";
import { ShoppingCartController } from "./controllers/ShoppingCartController";

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
const userService: UserService = new UserService();
const cartController: ShoppingCartController = new ShoppingCartController();

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

router.get("/products", (req, res) => gamesController.getAllGames(req, res));

// NOTE: After this line, all endpoints will check for a session.
router.use(sessionMiddleware);

router.get("/session", (req, res) => welcomeController.getSession(req, res));
router.delete("/session", (req, res) => welcomeController.deleteSession(req, res));
router.delete("/session/expired", (req, res) => welcomeController.deleteExpiredSessions(req, res));
router.get("/welcome", (req, res) => welcomeController.getWelcome(req, res));

router.post("/user/register", (req, res) => userController.registerUser(req, res));
router.get("/user/exists", (req, res) => userController.getUserByEmail(req, res));
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

router.post("/cart/add", (req, res) => cartController.addToCart(req, res));

router.delete("/cart/remove", (req, res) => cartController.removeFromCart(req, res));

router.delete("/cart/remove/all", (req, res) => cartController.removeAllFromCart(req, res));

router.get("/cart", (_req, _res) => {
    throw new Error("Return a list of products in the cart and the total price");
});

router.get("/user", (req, res) => userController.getData(req, res));
