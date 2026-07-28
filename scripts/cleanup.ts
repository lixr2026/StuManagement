import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(process.cwd(), ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const sql = postgres(process.env.DATABASE_URL!, { max: 2, prepare: false });
(async () => {
  try {
    const del = await sql`delete from student returning id`;
    console.log("已删除 student 测试数据:", del.length);
    const remain = await sql`select count(*)::int as c from student`;
    console.log("剩余 student 行:", remain[0].c);
    const adm = await sql`select username from admin`;
    console.log("admin 账号(保留):", adm.map((a:any)=>a.username));
  } catch (e) {
    console.error("清理失败:", (e as Error).message);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
  }
})();