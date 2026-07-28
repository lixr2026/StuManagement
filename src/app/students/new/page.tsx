import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { NewStudentClient } from "./new-student-client";

export const dynamic = "force-dynamic";

export default async function NewStudentPage() {
  const username = await getSession();
  if (!username) {
    redirect("/");
  }
  return <NewStudentClient />;
}