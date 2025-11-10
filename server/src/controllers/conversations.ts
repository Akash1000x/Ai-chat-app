import type { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js";
import { messages, conversations } from "../db/schema.js";
import { and, asc, desc, eq, ilike } from "drizzle-orm";
import { BadRequestError, InternalRequestError, NotFoundError, UnauthorizedError } from "../utils/errors.js";

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { offset } = req.query;

    if (!userId) {
      return next(new UnauthorizedError({ name: "AuthenticationError", message: "User is not authenticated" }));
    }

    const limit = 28;
    const conversationsData = await db
      .select({
        conversationId: conversations.id,
        title: conversations.title,
        shared: conversations.shared
      })
      .from(conversations)
      .where(and(eq(conversations.userId, userId), eq(conversations.isDeleted, false)))
      .orderBy(desc(conversations.createdAt))
      .limit(limit)
      .offset((Number(offset) || 0) * limit);

    res.status(200).json({ success: true, data: conversationsData });
  } catch (error) {
    console.error("getConversations error", error);
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
};

export const searchConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { search } = req.query;

    if (!search) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Search query is required" }))
    }

    const conversationsData = await db.select({
      conversationId: conversations.id,
      title: conversations.title,
      shared: conversations.shared
    }).from(conversations).where(and(eq(conversations.userId, userId), ilike(conversations.title, `%${search}%`)))

    res.status(200).json({ success: true, data: conversationsData });
  } catch (error) {
    console.error("searchConversations error", error);
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
};


export const shareConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    if (!conversationId || !userId) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Required fields are missing" }))
    }

    await db.update(conversations).set({ shared: true }).where(and(eq(conversations.id, conversationId as string), eq(conversations.userId, userId)))
    res.status(200).json({ success: true, message: "Conversation shared successfully" })
  } catch (error) {
    console.error("shareConversation error", error);
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
}

export const unshareConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    if (!conversationId || !userId) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Required fields are missing" }))
    }

    await db.update(conversations).set({ shared: false }).where(and(eq(conversations.id, conversationId as string), eq(conversations.userId, userId)))
    res.status(200).json({ success: true, message: "Conversation unshared successfully" })
  } catch (error) {
    console.error("unshareConversation error", error);
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
}

export const getSharedConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Required fields are missing" }))
    }

    const conversationsData = await db.query.conversations.findFirst({
      where: and(eq(conversations.id, conversationId as string), eq(conversations.shared, true))
    })
    if (!conversationsData) {
      return next(new NotFoundError({ name: "NotFoundError", message: "Conversation not found" }))
    }

    const messagesData = await db.select({
      id: messages.id,
      role: messages.role,
      parts: messages.parts,
      model: messages.model
    }).from(messages).where(eq(messages.conversationId, conversationsData.id)).orderBy(asc(messages.createdAt))

    res.status(200).json({ success: true, data: messagesData })
  } catch (error) {
    console.error("getSharedConversation error", error)
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
}


export const deleteConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Conversation 'id' is required" }))
    }

    await db.update(conversations).set({ isDeleted: true }).where(eq(conversations.id, conversationId as string))
    res.status(200).json({ success: true, message: "Conversation deleted successfully" })
  } catch (error) {
    console.error("deleteConversation error", error)
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
}

export const newConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newConversation = await db.insert(conversations).values({
      userId: req.user.id,
    }).returning({ id: conversations.id, title: conversations.title })

    res.status(200).json({ success: true, data: newConversation[0] })
  } catch (error) {
    console.log("newConversation Erro", error)
    new InternalRequestError({
      message: "Database query failed",
      name: "InternalRequestError"
    })
  }
}