import { Router } from 'express'
import { addModel, addModelCategory, deleteModel, deleteModelCategory, updateSuggestionsQuestions } from '@/controllers/admin.js'

const adminRouter: Router = Router();

adminRouter.post("/models", addModel)
adminRouter.delete("/models/:modelId", deleteModel)

adminRouter.post("/model-categories", addModelCategory)
adminRouter.delete("/model-categories/:categoryId", deleteModelCategory)
adminRouter.put("/suggestions-questions", updateSuggestionsQuestions)

export default adminRouter;