import { db } from "@/db/index.js";
import { threads } from "@/db/schema.js";
import { BadRequestError, InternalRequestError } from "@/utils/errors.js";
import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";

export const deleteConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Thread 'id' is required" }))
    }

    await db.update(threads).set({ isDeleted: true }).where(eq(threads.id, conversationId as string))
    res.status(200).json({ success: true, message: "Conversation deleted successfully" })
  } catch (error) {
    console.error("deleteConversation error", error)
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
}