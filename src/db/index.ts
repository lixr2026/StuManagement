import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// 使用单例避免开发模式下反复创建连接
const globalForDb = globalThis as typeof globalThis & {
  __dbClient?: ReturnType<typeof postgres>;
  __db?: ReturnType<typeof drizzle<typeof schema>>;
};

const client =
  globalForDb.__dbClient ??
  postgres(process.env.DATABASE_URL ?? "", { max: 5, prepare: false });

const db =
  globalForDb.__db ?? drizzle(client, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__dbClient = client;
  globalForDb.__db = db;
}

export { db };