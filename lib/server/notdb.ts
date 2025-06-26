import { createClient } from "notdb";

export const db = createClient({
  apiKey: process.env.NOTDB_API_KEY!,
  schema: {
    users: {
      properties: {
        name: { type: "string", required: true },
        email: { type: "string", required: true, unique: true },
        username: { type: "string", required: true, unique: true },
        githubId: { type: "string", required: true, unique: true },
        image: { type: "string", required: true },
      },
    },
    sessions: {
      properties: {
        token: { type: "string", required: true, unique: true },
        user_id: { type: "string", required: true },
        expires_at: { type: "string", required: true },
      },
    },
    snippets: {
      properties: {
        title: { type: "string", required: true },
        description: { type: "string" },
        code: { type: "string", required: true },
        user_id: { type: "string", required: true },
        is_public: { type: "boolean", required: true, default: false },
        language: {
          type: "string",
          required: true,
        },
        short_code: { type: "string", required: true, unique: true },
        collection_id: { type: "string" },
      },
    },
    collections: {
      properties: {
        name: { type: "string", required: true },
        description: { type: "string" },
        user_id: { type: "string", required: true },
      },
    },
  },
});
