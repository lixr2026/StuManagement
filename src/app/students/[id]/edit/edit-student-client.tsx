"use client";

import { useRouter } from "next/navigation";
import { StudentForm, type StudentFormValues } from "@/components/student-form";

interface Props {
  id: string;
  initial: StudentFormValues;
}

export function EditStudentClient({ id, initial }: Props) {
  const router = useRouter();

  async function onSubmit(values: StudentFormValues) {
    const res = await fetch(`/api/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.error ?? "修改失败" };
    // 修改成功，返回列表页显示最新结果
    router.replace("/dashboard?msg=updated");
    return { ok: true };
  }

  return <StudentForm mode="edit" initial={initial} onSubmit={onSubmit} />;
}