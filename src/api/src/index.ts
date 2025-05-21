import "@hboictcloud/metadata";

import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { Express } from "express";
import "express-async-errors";
import { router } from "./routes";

// Create an Express application
export const app: Express = express();

// Load the .env files
config();
config({ path: ".env.local", override: true });

const allowedOrigins: string[] = [
    "http://localhost:3000",
    "https://dev-naagooxeekuu77-pb4sef2425.hbo-ict.cloud",
    "https://naagooxeekuu77-pb4sef2425.hbo-ict.cloud",
];

// Enable CORS headers
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Niet toegestane origin"), false);
        }
    },
    credentials: true,
}));

// Enable JSON-body support for requests
app.use(express.json());

// Enable cookie support for requests
app.use(cookieParser());

// Forward all requests to the router for further handling
app.use("/", router);

// Start the Express application by listening for connections on the configured port
const port: number = (process.env.PORT || 8080) as number;

app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});
