import { Router } from "express";
import { streamData } from "@/controllers/chat.js";
import { getThreads } from "@/controllers/getThreads.js";
import { getMessages } from "@/controllers/getMessages.js";
import { getModels } from "@/controllers/getModels.js";
import { newConversation } from "@/controllers/newConversation.js";
import { deleteConversation } from "@/controllers/delete-conversation.js";

const chatRouter: Router = Router();

chatRouter.post("/", streamData);
chatRouter.get("/get-threads", getThreads);
chatRouter.get("/get-messages", getMessages);
chatRouter.get("/get-models", getModels);
chatRouter.post("/new", newConversation)
chatRouter.delete("/delete-conversation", deleteConversation)

export default chatRouter;
