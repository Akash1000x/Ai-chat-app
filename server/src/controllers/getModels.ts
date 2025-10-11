import { db } from "@/db/index.js";
import { modelCategories, models } from "@/db/schema.js";
import { InternalRequestError } from "@/utils/errors.js";
import type { NextFunction, Request, Response } from "express";


export const getModels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const modelsData = await db.query.modelCategories.findMany({
      columns: {
        id: true,
        name: true,
        slug: true
      },
      with: {
        models: {
          columns: {
            id: true,
            categoryId: true,
            isActive: true,
            isDefault: true,
            isPremium: true,
            name: true,
            slug: true
          },
          where: (models, { eq }) => eq(models.isActive, true)
        },
      }
    });
    res.status(200).json({ success: true, data: modelsData })
  } catch (error) {
    console.error("getMessages error", error)
    return next(
      new InternalRequestError({
        message: "Database query failed",
        name: "InternalRequestError"
      })
    )
  }
}