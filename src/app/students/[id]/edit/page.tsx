import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getStudentById } from "@/lib/student-query";
import { EditStudentClient } from "./edit-student-client";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function EditStudentPage({ params }: Params) {
  const username = await getSession();
  if (!username) {
    redirect("/");
  }

  const { id } = await params;
  const row = await getStudentById(id);
  if (!row) {
    redirect("/dashboard");
  }

  return (
    <EditStudentClient
      id={id}
      initial={{
        studentNo: row.studentNo,
        name: row.name,
        gender: row.gender ?? "",
        className: row.className ?? "",
        phone: row.phone ?? "",
        remark: row.remark ?? "",
      }}
    />
  );
}