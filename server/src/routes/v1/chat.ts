import { Router } from "express";
import { streamData } from "@/controllers/chat.js";
import { getSharedThread, getThreads, searchThreads, shareThread, unshareThread } from "@/controllers/getThreads.js";
import { getMessages } from "@/controllers/getMessages.js";
import { getModels } from "@/controllers/getModels.js";
import { newConversation } from "@/controllers/newConversation.js";
import { deleteConversation } from "@/controllers/delete-conversation.js";
import { authMiddleware } from "@/utils/authmiddleware.js";

const chatRouter: Router = Router();

chatRouter.post("/", authMiddleware, streamData);
chatRouter.get("/threads", authMiddleware, getThreads);
chatRouter.get("/threads/search", authMiddleware, searchThreads);
chatRouter.get("/messages/:conversationId", authMiddleware, getMessages);
chatRouter.post("/new", authMiddleware, newConversation)
chatRouter.delete("/conversation/:conversationId", authMiddleware, deleteConversation)
chatRouter.get("/models", getModels);

chatRouter.post("/conversation/:conversationId/share", authMiddleware, shareThread);
chatRouter.post("/conversation/:conversationId/unshare", authMiddleware, unshareThread);
chatRouter.get("/conversation/shared/:conversationId", getSharedThread);

export default chatRouter;
