import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { SearchBox } from "@/components/search-box";
import { FlashMessage } from "@/components/flash-message";
import { Button } from "@/components/ui/button";
import { queryStudents } from "@/lib/student-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string; pageSize?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const username = await getSession();
  if (!username) {
    redirect("/");
  }

  const sp = await searchParams;
  const q = sp.q ?? "";
  const page = sp.page ? Number(sp.page) : 1;
  const pageSize = sp.pageSize ? Number(sp.pageSize) : 100;
  const { items } = await queryStudents({ q, page, pageSize });

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="flex items-center justify-between border-b bg-background px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">欢迎使用，{username}</h1>
          <p className="text-sm text-muted-foreground">学生信息管理系统</p>
        </div>
        <LogoutButton />
      </header>

      <section className="mx-auto max-w-5xl space-y-4 p-6">
        <Suspense fallback={null}>
          <FlashMessage />
        </Suspense>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">学生信息列表</h2>
          <div className="flex items-center gap-3">
            <Suspense fallback={<div className="h-10 w-64" />}>
              <SearchBox />
            </Suspense>
            <Button asChild>
              <Link href="/students/new">添加学生</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-md border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>学号</TableHead>
                <TableHead>姓名</TableHead>
                <TableHead>性别</TableHead>
                <TableHead>班级</TableHead>
                <TableHead>电话</TableHead>
                <TableHead className="min-w-[200px]">备注</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    暂无学生信息
                  </TableCell>
                </TableRow>
              ) : (
                items.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.studentNo}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.gender ?? "—"}</TableCell>
                    <TableCell>{s.className ?? "—"}</TableCell>
                    <TableCell>{s.phone ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{s.remark ?? "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}