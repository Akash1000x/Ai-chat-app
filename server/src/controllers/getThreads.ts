import type { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js";
import { messages, threads } from "../db/schema.js";
import { and, asc, desc, eq, ilike } from "drizzle-orm";
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
        shared: threads.shared
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
      title: threads.title,
      shared: threads.shared
    }).from(threads).where(and(eq(threads.userId, userId), ilike(threads.title, `%${search}%`)))

    res.status(200).json({ success: true, data: threadsData });
  } catch (error) {
    console.error("searchThreads error", error);
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
};


export const shareThread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { threadId } = req.query;
    if (!threadId || !userId) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Required fields are missing" }))
    }

    await db.update(threads).set({ shared: true }).where(and(eq(threads.id, threadId as string), eq(threads.userId, userId)))
    res.status(200).json({ success: true, message: "Thread shared successfully" })
  } catch (error) {
    console.error("shareThread error", error);
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
}

export const unshareThread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { threadId } = req.query;
    if (!threadId || !userId) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Required fields are missing" }))
    }

    await db.update(threads).set({ shared: false }).where(and(eq(threads.id, threadId as string), eq(threads.userId, userId)))
    res.status(200).json({ success: true, message: "Thread unshared successfully" })
  } catch (error) {
    console.error("unshareThread error", error);
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
}

export const getSharedThread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { threadId } = req.query;
    if (!threadId) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Required fields are missing" }))
    }

    const threadsData = await db.query.threads.findFirst({
      where: and(eq(threads.id, threadId as string), eq(threads.shared, true))
    })
    if (!threadsData) {
      return next(new NotFoundError({ name: "NotFoundError", message: "Thread not found" }))
    }

    const messagesData = await db.select({
      id: messages.id,
      role: messages.role,
      parts: messages.parts,
      model: messages.model
    }).from(messages).where(eq(messages.threadId, threadsData.id)).orderBy(asc(messages.createdAt))

    res.status(200).json({ success: true, data: messagesData })
  } catch (error) {
    console.error("getSharedThread error", error)
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
}