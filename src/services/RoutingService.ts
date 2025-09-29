// src/services/RoutingService.ts
import { Request } from "express";
import crypto from "crypto";
const fs = require("fs");
const path = require("path");

type Version = "blue" | "green";

type Config = {
  strategyOrder: ("cookie" | "header" | "ip" | "percentage")[];
  cookieName?: string;
  headerName?: string;
  percentage?: { blue: number; green: number };
  sticky?: boolean;
  stickyDays?: number;
};

export class RoutingService {
  private config: Config;
  private blue: any;
  private green: any;
  private cookieName: string;
  private headerName: string;

  constructor(configPath?: string) {
    const cfgPath = configPath || path.join(__dirname, "../config/routing-config.json");
    this.config = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));

    this.blue = JSON.parse(fs.readFileSync(path.join(__dirname, "../config/blue.json"), "utf-8"));
    this.green = JSON.parse(fs.readFileSync(path.join(__dirname, "../config/green.json"), "utf-8"));

    this.cookieName = this.config.cookieName || "pricing_version";
    this.headerName = (this.config.headerName || "x-version").toLowerCase();
  }

  private chooseByPercentage(): Version {
    const p = this.config.percentage || { blue: 50, green: 50 };
    const rand = Math.random() * 100;
    return rand < p.blue ? "blue" : "green";
  }

  private hashToPercent(input: string): number {
    const hash = crypto.createHash("sha256").update(input).digest();
    const val = hash.readUInt32BE(0);
    return (val % 100) + 1;
  }

  private chooseByIp(ip?: string): Version {
    if (!ip) return this.chooseByPercentage();
    const pct = this.hashToPercent(ip);
    const p = this.config.percentage || { blue: 50, green: 50 };
    return pct <= p.blue ? "blue" : "green";
  }

  public getVersionForRequest(req: Request): {
    version: Version;
    data: any;
    setCookie?: { name: string; value: string; options: any };
  } {
    const order = this.config.strategyOrder || ["cookie", "header", "ip", "percentage"];

    for (const strategy of order) {
      if (strategy === "cookie") {
        const cookieVal = req.cookies?.[this.cookieName];
        if (cookieVal === "blue" || cookieVal === "green") {
          return { version: cookieVal as Version, data: cookieVal === "blue" ? this.blue : this.green };
        }
      }

      if (strategy === "header") {
        const val = (req.headers[this.headerName] as string) || "";
        if (val.toLowerCase().includes("blue")) return { version: "blue", data: this.blue };
        if (val.toLowerCase().includes("green")) return { version: "green", data: this.green };
      }

      if (strategy === "ip") {
        const ip = (req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress) as string | undefined;
        const chosen = this.chooseByIp(ip);
        return {
          version: chosen,
          data: chosen === "blue" ? this.blue : this.green,
          setCookie: this.config.sticky
            ? {
                name: this.cookieName,
                value: chosen,
                options: { maxAge: (this.config.stickyDays || 30) * 24 * 60 * 60 * 1000, httpOnly: false },
              }
            : undefined,
        };
      }

      if (strategy === "percentage") {
        const chosen = this.chooseByPercentage();
        return {
          version: chosen,
          data: chosen === "blue" ? this.blue : this.green,
          setCookie: this.config.sticky
            ? {
                name: this.cookieName,
                value: chosen,
                options: { maxAge: (this.config.stickyDays || 30) * 24 * 60 * 60 * 1000, httpOnly: false },
              }
            : undefined,
        };
      }
    }

    // fallback
    const fallback = this.chooseByPercentage();
    return {
      version: fallback,
      data: fallback === "blue" ? this.blue : this.green,
      setCookie: this.config.sticky
        ? {
            name: this.cookieName,
            value: fallback,
            options: { maxAge: (this.config.stickyDays || 30) * 24 * 60 * 60 * 1000, httpOnly: false },
          }
        : undefined,
    };
  }
}
