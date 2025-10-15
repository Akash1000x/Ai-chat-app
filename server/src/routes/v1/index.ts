import { Router } from "express";
import chatRouter from "./chat.js";
import { GetSuggestionsQuestions } from "@/controllers/getSuggestionsQuestions.js";

const router: Router = Router();

router.use("/chat", chatRouter);
router.get("/get-suggestions-questions", GetSuggestionsQuestions);

export default router;
