import type { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js";
import { threads } from "../db/schema.js";
import { and, desc, eq, ilike } from "drizzle-orm";
import { BadRequestError, InternalRequestError, NotFoundError, UnauthorizedError } from "../utils/errors.js";

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

export const searchThreads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { search } = req.query;

    if (!search) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Search query is required" }))
    }

    const threadsData = await db.select({
      threadId: threads.id,
      title: threads.title
    }).from(threads).where(and(eq(threads.userId, userId), ilike(threads.title, `%${search}%`)))

    res.status(200).json({ success: true, data: threadsData });
  } catch (error) {
    console.error("searchThreads error", error);
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
};