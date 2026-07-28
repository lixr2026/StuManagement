import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admin } from "@/db/schema";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const username = (body?.username ?? "").trim();
    const password = (body?.password ?? "").toString();

    if (!username || !password) {
      return NextResponse.json({ error: "请输入用户名和密码" }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(admin)
      .where(eq(admin.username, username))
      .limit(1);

    if (rows.length === 0 || rows[0].password !== password) {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
    }

    await createSession(username);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[login] error", e);
    return NextResponse.json({ error: "服务器错误，请检查数据库连接" }, { status: 500 });
  }
}