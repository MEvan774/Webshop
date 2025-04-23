import { Router } from "express";
import { WelcomeController } from "./controllers/WelcomeController";
import { requireValidSessionMiddleware, sessionMiddleware } from "./middleware/sessionMiddleware";
import { GamesController } from "./controllers/GamesController";
import { getGameWithGameID } from "./services/CurrentGameService";

// Create a router
export const router: Router = Router();

// Setup endpoints
router.get("/", (_, res) => {
    res.send("Welcome to the API!");
});

// Forward endpoints to other routers
const welcomeController: WelcomeController = new WelcomeController();
const gamesController: GamesController = new GamesController();

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

// NOTE: After this line, all endpoints will check for a session.
router.use(sessionMiddleware);

router.get("/session", (req, res) => welcomeController.getSession(req, res));
router.delete("/session", (req, res) => welcomeController.deleteSession(req, res));
router.delete("/session/expired", (req, res) => welcomeController.deleteExpiredSessions(req, res));
router.get("/welcome", (req, res) => welcomeController.getWelcome(req, res));

router.get("/products", (req, res) => gamesController.getAllGames(req, res));

// NOTE: After this line, all endpoints will require a valid session.
router.use(requireValidSessionMiddleware);

router.get("/secret", (req, res) => welcomeController.getSecret(req, res));

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
