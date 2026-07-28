import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { student } from "@/db/schema";

export async function GET() {
  const rows = await db.select().from(student).orderBy(student.studentNo);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const studentNo = (body?.studentNo ?? "").trim();
    const name = (body?.name ?? "").trim();

    if (!studentNo || !name) {
      return NextResponse.json({ error: "学号和姓名为必填项" }, { status: 400 });
    }

    const inserted = await db
      .insert(student)
      .values({
        studentNo,
        name,
        gender: body?.gender ?? null,
        className: body?.className ?? null,
        phone: body?.phone ?? null,
        remark: body?.remark ?? null,
      })
      .returning();

    return NextResponse.json({ ok: true, student: inserted[0] });
  } catch (e) {
    console.error("[students POST] error", e);
    return NextResponse.json({ error: "添加失败，请检查数据库连接" }, { status: 500 });
  }
}