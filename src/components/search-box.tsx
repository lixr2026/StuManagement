"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const [value, setValue] = useState(q);
  const [pending, startTransition] = useTransition();

  function submit(next: string) {
    const sp = new URLSearchParams(params.toString());
    if (next.trim()) {
      sp.set("q", next.trim());
    } else {
      sp.delete("q");
    }
    sp.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${sp.toString()}`);
    });
  }

  return (
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit(value)}
        onBlur={() => submit(value)}
        placeholder="搜索学号 / 姓名 / 班级"
        className="pl-9"
        aria-label="搜索"
      />
      {pending && <span className="sr-only">加载中</span>}
    </div>
  );
}