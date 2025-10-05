import { relations, sql } from "drizzle-orm";
import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: t.timestamp("created_at").notNull().defaultNow(),
  updatedAt: t.timestamp("updated_at"),
};

export const userRoleEnum = t.pgEnum("user_role", ["user", "admin"]);
export const messageRoleEnum = t.pgEnum("message_role", ["user", "assistant"]);

export const users = table(
  "users",
  {
    id: t
      .text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: t.text("name").notNull(),
    email: t.text("email").notNull(),
    profilePictureUrl: t.text("profile_picture_url"),
    premium: t.boolean("premium").notNull().default(false),
    tokensUsed: t.integer("tokens_used").notNull().default(0),
    role: userRoleEnum(),
    selectedModel: t.text("selected_model"),

    ...timestamps,
  },
  (table) => ({
    emailIndex: t.uniqueIndex("email_idx").on(table.email),
  })
);

export const threads = table(
  "threads",
  {
    id: t
      .text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: t.text("user_id").references(() => users.id),
    title: t.text("title"),
    isDeleted: t.boolean("is_deleted").notNull().default(false),

    ...timestamps,
  },
  (table) => ({
    userIndex: t.index("user_ids").on(table.userId),
    isDeletedIndex: t.index("is_deleted_idx").on(table.isDeleted),
  })
);

//TODO: should I need to add userId to the messages table?
export const messages = table(
  "messages",
  {
    id: t
      .text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    threadId: t.text("thread_id").references(() => threads.id),
    role: messageRoleEnum(),
    parts: t.json("parts").$type<
      {
        type: "text";
        text: string;
      }[]
    >(),

    ...timestamps,
  },
  (table) => ({
    threadIndex: t.index("thread_idx").on(table.threadId),
  })
);

export const usage = table("usage", {
  id: t
    .text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: t.text("user_id").references(() => users.id),
  tokensUsed: t.integer("tokens_used"),
  data: t.date("data").notNull(),

  ...timestamps,
});

export const modelCategories = table("model_categories", {
  id: t
    .text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: t.text("name").notNull(),
  apiKey: t.text("api_key").notNull(),
  baseUrl: t.text("base_url"),

  ...timestamps,
});


export const models = table("models", {
  id: t
    .text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: t.text("name").notNull(),
  isDefault: t.boolean("is_default").notNull().default(false),
  isActive: t.boolean("is_active").notNull().default(true),
  isPremium: t.boolean("is_premium").notNull().default(true),
  categoryId: t.text("category_id").references(() => modelCategories.id),

  ...timestamps,
});


export const modelCategoriesRelations = relations(modelCategories, ({ many }) => ({
  models: many(models)
}))

export const modelsRelations = relations(models, ({ one }) => ({
  category: one(modelCategories, {
    fields: [models.categoryId],
    references: [modelCategories.id]
  })
}))