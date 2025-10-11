import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response, NextFunction } from "express";
import { auth } from "./auth.js";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    console.log("authMiddleware session", session);
    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach user to req for use in routes
    req.user = session.user;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}