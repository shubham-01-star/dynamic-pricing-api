import express from "express";
import cookieParser from "cookie-parser";
import { RoutingService } from "./services/RoutingService"; // if default export, else { RoutingService }
import { RoutingService as RS } from "./services/RoutingService";
import { PricingController } from "./controllers/PricingController";
import cors from "cors";
import morgan from "morgan";
import path from "path";

const app = express();
app.use(express.json());
app.use(cookieParser());

// allow frontend localhost; adjust as needed
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));

// instantiate routing service (reads config from config file inside src/config)
const routing = new RS(path.join(__dirname, "./config/routing-config.json"));
const controller = new PricingController(routing);

// endpoint
app.get("/pricing", controller.getPricing);

// health
app.get("/health", (_req, res) => res.send({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
