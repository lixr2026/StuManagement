"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RowActions({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("确定删除该学生记录吗？")) return;
    startTransition(async () => {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        // 刷新表格数据
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
    </div>
  );
}