import OpenAI from "openai";
import { type NextFunction, type Request, type Response } from "express";
import { messages as messagesTable, models, threads } from "../db/schema.js";
import { db } from "../db/index.js";
import { BadRequestError, InternalRequestError } from "@/utils/errors.js";
import { eq } from "drizzle-orm";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

const geminiClient = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.GOOGLE_API_KEY,
});

interface RequestBody {
  model: (typeof models.$inferSelect);
  preferences: string;
  messages: (typeof messagesTable.$inferSelect)[];
  threadId: string;
  prompt: string;
  newConversation: boolean;
}

const systemPrompt = (preferences: string) => {
  return `
You are a helpful assistant that can answer the questions of the user.

User Preferences:
  - ${preferences}
`;
};

const SystemPromptToGetTitle = `
  You are a helpful assistant that can give a short title for the user's question.
  ONLY give the title(not add title text in the title), no other text. NO COMMENTS, NO CONFIRMATION, NO EXPLANATION, NO THANK YOU, NO NOTHING.
`

export const streamData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { model, preferences, messages, threadId, prompt, newConversation }: RequestBody = req.body;

    if (!threadId) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Thread 'id' is required" }));
    }

    if (newConversation) {
      const res = await geminiClient.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
          { role: "system", content: SystemPromptToGetTitle },
          { role: "user", content: prompt },
        ],
        stream: false,
      })
      await db.update(threads).set({
        title: res.choices[0]?.message?.content,
      }).where(eq(threads.id, threadId));
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const messagesData: { role: "user" | "assistant"; content: string }[] = messages.map((message) => {
      return {
        role: message.role as "user" | "assistant",
        content: message.parts ? message.parts[0]?.text ?? "" : "",
      };
    });
    messagesData.push({
      role: "user",
      content: prompt,
    });


    const resStream = await client.chat.completions.create({
      model: model.slug,
      messages: [
        { role: "system", content: systemPrompt(preferences) },
        ...messagesData,
      ],
      stream: true,
    });

    let fullMessage = "";
    for await (const chunk of resStream) {
      const chunkData = chunk.choices[0]?.delta.content || "";
      // chunk.usage && console.log("chunk.usage", chunk.usage);
      if (!!chunkData) {
        fullMessage += chunkData;
        const data = { type: "text", message: chunkData, time: new Date().toISOString() };
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
    }
    res.write("[DONE]\n\n");
    res.end();

    await db.insert(messagesTable).values({
      threadId,
      model: model.slug,
      role: "user",
      parts: [{ type: "text", text: messagesData[messagesData.length - 1]?.content ?? "" }],
    });
    await db.insert(messagesTable).values({
      threadId,
      model: model.slug,
      role: "assistant",
      parts: [{ type: "text", text: fullMessage }],
    });
  } catch (error: any) {
    console.log("streamData error:", error);

    if (error?.status === 400) {
      return next(new BadRequestError({ message: error?.message || "Bad Request (invalid or missing params, CORS)", name: "BadRequestError" }));
    } else if (error?.status === 401) {
      return next(new BadRequestError({ message: error?.message || "Invalid credentials (OAuth session expired, disabled/invalid API key)", name: "BadRequestError" }));
    } else if (error?.status === 402) {
      return next(new BadRequestError({ message: error?.message || "Your account or API key has insufficient credits.", name: "BadRequestError" }));
    } else if (error?.status === 403) {
      return next(new BadRequestError({ message: error?.message || "Your chosen model requires moderation and your input was flagged", name: "BadRequestError" }));
    } else if (error?.status === 408) {
      return next(new BadRequestError({ message: "Your request timed out", name: "BadRequestError" }));
    } else if (error?.status === 429) {
      return next(new BadRequestError({ message: "You are being rate limited", name: "BadRequestError" }));
    } else if (error?.status === 502) {
      return next(new BadRequestError({ message: "Your chosen model is down or we received an invalid response from it", name: "BadRequestError" }));
    } else if (error?.status === 503) {
      return next(new BadRequestError({ message: "There is no available model provider that meets your routing requirements", name: "BadRequestError" }));
    }

    return next(new InternalRequestError({ message: "Internal server error", name: "InternalRequestError" }));
  }
};
