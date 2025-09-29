import { Request, Response } from "express";
import { RoutingService } from "../services/RoutingService";
import { logRequest } from "../utils/logger";

export class PricingController {
  routingService: RoutingService;

  constructor(routingService: RoutingService) {
    this.routingService = routingService;
  }

  getPricing = (req: Request, res: Response) => {
    const result = this.routingService.getVersionForRequest(req);
    // logging
    logRequest(req, result.version);
    // set cookie if required for sticky sessions
    if (result.setCookie) {
      const { name, value, options } = result.setCookie;
      res.cookie(name, value, options);
    }
    res.json({ servedVersion: result.version, pricing: result.data });
  };
}
