import { db } from "@/db/index.js";
import { threads } from "@/db/schema.js";
import { InternalRequestError } from "@/utils/errors.js";
import type { NextFunction, Request, Response } from "express";


export const newConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newThread = await db.insert(threads).values({
      userId: req.user.id,
    }).returning({ id: threads.id, title: threads.title })

    res.status(200).json({ success: true, data: newThread[0] })
  } catch (error) {
    console.log("newConversation Erro", error)
    new InternalRequestError({
      message: "Database query failed",
      name: "InternalRequestError"
    })
  }
}