"use client";

import { useRouter } from "next/navigation";
import { StudentForm, type StudentFormValues } from "@/components/student-form";

export function NewStudentClient() {
  const router = useRouter();

  async function onSubmit(values: StudentFormValues) {
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.error ?? "添加失败" };
    // 添加成功：返回列表页并显示"添加学生信息成功"
    router.replace("/dashboard?msg=added");
    return { ok: true };
  }

  return <StudentForm mode="create" onSubmit={onSubmit} />;
}