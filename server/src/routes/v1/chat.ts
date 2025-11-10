import { Router } from "express";
import { streamData } from "@/controllers/chat.js";
import { deleteConversation, getConversations, getSharedConversation, newConversation, searchConversations, shareConversation, unshareConversation } from "@/controllers/conversations.js";
import { getMessages } from "@/controllers/messages.js";
import { getModels } from "@/controllers/models.js";
import { authMiddleware } from "@/utils/authmiddleware.js";

const chatRouter: Router = Router();

chatRouter.post("/", authMiddleware, streamData);
chatRouter.get("/conversations", authMiddleware, getConversations);
chatRouter.get("/conversations/search", authMiddleware, searchConversations);
chatRouter.get("/messages/:conversationId", authMiddleware, getMessages);
chatRouter.post("/new", authMiddleware, newConversation)
chatRouter.delete("/conversation/:conversationId", authMiddleware, deleteConversation)
chatRouter.get("/models", getModels);

chatRouter.post("/conversation/:conversationId/share", authMiddleware, shareConversation);
chatRouter.post("/conversation/:conversationId/unshare", authMiddleware, unshareConversation);
chatRouter.get("/conversation/shared/:conversationId", getSharedConversation);

export default chatRouter;
