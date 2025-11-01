import "dotenv/config"
import { modelCategories, models } from "./schema.js";
import { drizzle } from "drizzle-orm/node-postgres";

const Threads = [
  "drizzle-seed",
  "greeting",
  "spel check",
  "example",
  "how to install arc linux in hp laptop",
  "how to add a screen in the laptop",
];

async function main() {
  // const db = drizzle(process.env.DATABASE_URL!);

  // const insertedUser = await db
  //   .insert(users)
  //   .values({
  //     name: `test user`,
  //     email: `test@gmai.com`,
  //     role: "user",
  //     profilePictureUrl: null,
  //     premium: false,
  //     tokensUsed: 0,
  //     selectedModel: null,
  //   })
  //   .returning({ id: users.id });

  // const insertedThreads = await db
  //   .insert(threads)
  //   .values(
  //     Array.from({ length: 20 }).map((_, i) => ({
  //       userId: insertedUser[0]?.id,
  //       title: Threads[i % 7],
  //     }))
  //   )
  //   .returning({ id: threads.id });

  // type InsertMessage = typeof messages.$inferInsert;

  // await db.insert(messages).values(
  //   insertedThreads.flatMap<InsertMessage>((id) => {
  //     return Array.from({ length: 10 }).map((_, i) => ({
  //       threadId: id.id,
  //       role: i % 2 === 0 ? "user" : "assistant",
  //       parts: [
  //         {
  //           type: "text",
  //           text:
  //             i % 3 === 0
  //               ? "The sun set behind the mountains, painting the sky in hues of orange and purple."
  //               : i % 3 === 1
  //                 ? "The rain tapped gently on the window, a soothing rhythm against the quiet night."
  //                 : "A cool breeze carried the scent of jasmine through the quiet village street.",
  //         },
  //       ],
  //     }));
  //   })
  // );

  // const insertModelsCategories = await db.insert(modelCategories).values([
  //   {
  //     name: "gemini",
  //     slug: "gemini",
  //   },
  //   {
  //     name: "DeepSeek",
  //     slug: "deepseek",
  //   },
  //   {
  //     name: "Z.ai",
  //     slug: "z-ai",
  //   }
  // ]).returning({ id: modelCategories.id, slug: modelCategories.slug });


  // await db.insert(models).values(
  //   [
  //     {
  //       name: "glm 4.5 air",
  //       slug: "z-ai/glm-4.5-air:free",
  //       categoryId: insertModelsCategories.find((c) => c.slug === "z-ai")?.id ?? "",
  //       isActive: true,
  //       isDefault: false,
  //     },
  //     {
  //       name: "deepseek r1 t2 chimera",
  //       slug: "tngtech/deepseek-r1t2-chimera:free",
  //       categoryId: insertModelsCategories.find((c) => c.slug === "deepseek")?.id ?? "",
  //       isActive: true,
  //       isDefault: false,
  //     },
  //     {
  //       name: "gemini 2.0 flash",
  //       slug: "gemini-2.0-flash",
  //       categoryId: insertModelsCategories.find((c) => c.slug === "gemini")?.id ?? "",
  //       isActive: true,
  //       isDefault: true,
  //     }
  //   ]
  // )
}

main();
