import type { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js";
import { threads } from "../db/schema.js";
import { and, desc, eq } from "drizzle-orm";
import { InternalRequestError, NotFoundError, UnauthorizedError } from "../utils/errors.js";

export const getThreads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { offset } = req.query;

    if (!userId) {
      return next(new UnauthorizedError({ name: "AuthenticationError", message: "User is not authenticated" }));
    }

    const threadsData = await db
      .select({
        threadId: threads.id,
        title: threads.title,
      })
      .from(threads)
      .where(and(eq(threads.userId, userId), eq(threads.isDeleted, false)))
      .orderBy(desc(threads.createdAt))
      .limit(10)
      .offset(Number(offset) || 0);

    res.status(200).json({ success: true, data: threadsData });
  } catch (error) {
    console.error("getThreads error", error);
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
};
