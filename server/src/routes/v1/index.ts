import { Router } from "express";
import chatRouter from "./chat.js";
import { GetSuggestionsQuestions } from "@/controllers/sugestion-questions.js";
import adminRouter from "./admin.js";

const router: Router = Router();

router.use("/chat", chatRouter);
router.get("/suggestions-questions", GetSuggestionsQuestions);
router.use("/admin", adminRouter);
export default router;
