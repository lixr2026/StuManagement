import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(process.cwd(), ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const url = process.env.DATABASE_URL!;
const sql = postgres(url, { max: 2, prepare: false });

(async () => {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "supabase/schema.sql"), "utf8");
    // postgres-js 的 unsafe 默认不支持多语句；启用 simple 模式逐条执行
    const statements = raw
      .split(/;\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    console.log(`将执行 ${statements.length} 条语句`);
    for (const stmt of statements) {
      await sql.unsafe(stmt);
    }
    const tables = await sql`select tablename from pg_tables where schemaname='public' order by tablename`;
    console.log("建表后现有表:", tables.map((t: any) => t.tablename));
    const admins = await sql`select username from admin`;
    console.log("admin 账号:", admins.map((a: any) => a.username));
  } catch (e) {
    console.error("执行失败:", (e as Error).message);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
  }
})();