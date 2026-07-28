"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RowActions({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("确定删除该学生记录吗？")) return;
    startTransition(async () => {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("删除失败");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="destructive"
        onClick={handleDelete}
        disabled={pending}
      >
        {pending ? "删除中…" : "删除"}
      </Button>
      <Link
        href={`/students/${id}/edit`}
        className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
      >
        修改
      </Link>
    </div>
  );
}