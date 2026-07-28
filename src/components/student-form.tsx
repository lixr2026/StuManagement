"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface StudentFormValues {
  studentNo: string;
  name: string;
  gender: string;
  className: string;
  phone: string;
  remark: string;
}

interface Props {
  mode: "create" | "edit";
  initial?: Partial<StudentFormValues>;
  cancelHref?: string;
  onSubmit: (values: StudentFormValues) => Promise<{ ok: boolean; error?: string }>;
}

export function StudentForm({ mode, initial, cancelHref = "/dashboard", onSubmit }: Props) {
  const [form, setForm] = useState<StudentFormValues>({
    studentNo: initial?.studentNo ?? "",
    name: initial?.name ?? "",
    gender: initial?.gender ?? "",
    className: initial?.className ?? "",
    phone: initial?.phone ?? "",
    remark: initial?.remark ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof StudentFormValues, v: string) {
    setForm((f) => ({ ...f, [field]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.studentNo.trim() || !form.name.trim()) {
      setError("学号和姓名为必填项");
      return;
    }
    setLoading(true);
    try {
      const result = await onSubmit(form);
      if (!result.ok) {
        setError(result.error ?? "保存失败");
        setLoading(false);
      }
    } catch {
      setError("网络错误，请重试");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{mode === "create" ? "添加学生" : "修改学生"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="studentNo">学号 *</Label>
              <Input id="studentNo" value={form.studentNo} onChange={(e) => set("studentNo", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">姓名 *</Label>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">性别</Label>
              <select
                id="gender"
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">请选择</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="className">班级</Label>
              <Input id="className" value={form.className} onChange={(e) => set("className", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">电话</Label>
              <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="remark">备注</Label>
              <Input id="remark" value={form.remark} onChange={(e) => set("remark", e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={cancelHref}>取消</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "保存中…" : "保存"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}