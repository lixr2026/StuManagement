import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// 管理员表（登录账号）
export const admin = pgTable("admin", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  // 明文存储起步，后续可升级为 bcrypt 哈希
  password: text("password").notNull(),
});

// 学生信息表
export const student = pgTable("student", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentNo: text("student_no").notNull(), // 学号
  name: text("name").notNull(), // 姓名
  gender: text("gender"), // 性别
  className: text("class"), // 班级
  phone: text("phone"), // 电话
  remark: text("remark"), // 备注
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Admin = typeof admin.$inferSelect;
export type Student = typeof student.$inferSelect;
export type NewStudent = typeof student.$inferInsert;