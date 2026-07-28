import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * 适配 Vercel serverless 的连接配置：
 * - 单例缓存避免冷启动反复建连
 * - 较小的连接上限与空闲/连接超时，防止函数实例堆积连接
 * - prepare:false 适配 Supabase transaction-mode pooler (端口 6543)
 */
const globalForDb = globalThis as typeof globalThis & {
  __dbClient?: ReturnType<typeof postgres>;
  __db?: ReturnType<typeof drizzle<typeof schema>>;
};

const isProd = process.env.NODE_ENV === "production";

const client =
  globalForDb.__dbClient ??
  postgres(process.env.DATABASE_URL ?? "", {
    max: isProd ? 3 : 5,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: "require",
  });

const db = globalForDb.__db ?? drizzle(client, { schema });

if (!isProd) {
  globalForDb.__dbClient = client;
  globalForDb.__db = db;
}

export { db };