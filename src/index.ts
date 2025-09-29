import express from "express";
import cookieParser from "cookie-parser";
import { RoutingService } from "./services/RoutingService";
import { PricingController } from "./controllers/PricingController";
import cors from "cors";
import morgan from "morgan";
import path from "path";

const app = express();
app.use(express.json());
app.use(cookieParser());

// API base URL
const baseUrl = "/api/v1";

// allow frontend (adjust origin for your frontend URL)
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));

// instantiate routing service (reads config from config file inside src/config)
const routing = new RoutingService(
  path.join(__dirname, "./config/routing-config.json")
);
const controller = new PricingController(routing);

// endpoints
app.get(`${baseUrl}/pricing`, controller.getPricing);

// health check
app.get(`${baseUrl}/health`, (_req, res) => res.send({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend listening on port ${PORT}`));
