import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { student } from "@/db/schema";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const updated = await db
      .update(student)
      .set({
        studentNo: body.studentNo?.trim() || undefined,
        name: body.name?.trim() || undefined,
        gender: body.gender ?? undefined,
        className: body.className ?? undefined,
        phone: body.phone ?? undefined,
        remark: body.remark ?? undefined,
      })
      .where(eq(student.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "学生不存在" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, student: updated[0] });
  } catch (e) {
    console.error("[students PATCH] error", e);
    return NextResponse.json({ error: "修改失败" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const deleted = await db.delete(student).where(eq(student.id, id)).returning();
    if (deleted.length === 0) {
      return NextResponse.json({ error: "学生不存在" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[students DELETE] error", e);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}