import { db } from "@/db";
import { student } from "@/db/schema";
import { desc, ilike, or, sql, count } from "drizzle-orm";

export interface StudentQueryParams {
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface StudentQueryResult {
  items: (typeof student.$inferSelect)[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 学生列表查询：支持按 学号/姓名/班级 模糊查询 + 分页 */
export async function queryStudents(params: StudentQueryParams = {}): Promise<StudentQueryResult> {
  const pageSize = Math.min(Math.max(params.pageSize ?? 10, 1), 20);
  const page = Math.max(params.page ?? 1, 1);
  const q = (params.q ?? "").trim();

  const where = q
    ? or(
        ilike(student.studentNo, `%${q}%`),
        ilike(student.name, `%${q}%`),
        ilike(student.className, `%${q}%`)
      )
    : sql`true`;

  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(student)
      .where(where)
      .orderBy(desc(student.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ value: count() }).from(student).where(where),
  ]);

  const total = Number(totalRows[0]?.value ?? 0);
  return {
    items: rows,
    total,
    page,
    pageSize,
    totalPages: Math.max(Math.ceil(total / pageSize), 1),
  };
}

/** 取单条学生（编辑页使用） */
export async function getStudentById(id: string) {
  const rows = await db.select().from(student).where(sql`${student.id} = ${id}`).limit(1);
  return rows[0] ?? null;
}