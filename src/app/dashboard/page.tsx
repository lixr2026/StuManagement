import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const username = await getSession();
  if (!username) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="flex items-center justify-between border-b bg-background px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">欢迎使用，{username}</h1>
          <p className="text-sm text-muted-foreground">学生信息管理系统</p>
        </div>
        <LogoutButton />
      </header>
      <section className="mx-auto max-w-5xl p-6">
        <p className="text-muted-foreground">登录成功。学生信息列表将在后续功能中在此展示。</p>
      </section>
    </main>
  );
}