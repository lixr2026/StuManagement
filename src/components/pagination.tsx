"use client";

import { useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface Props {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

export function Pagination({ page, pageSize, totalPages, total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function go(nextPage: number, nextSize?: number) {
    const sp = new URLSearchParams(params.toString());
    const size = nextSize ?? pageSize;
    const clamped = Math.min(Math.max(nextPage, 1), totalPages);
    sp.set("page", String(clamped));
    sp.set("pageSize", String(size));
    startTransition(() => {
      router.replace(`${pathname}?${sp.toString()}`);
    });
  }

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-2 py-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-3">
        <span>
          共 {total} 条，第 {start}-{end} 条
        </span>
        <label className="flex items-center gap-2">
          每页
          <select
            value={pageSize}
            onChange={(e) => go(1, Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="每页条数"
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          条
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => go(1)}
          disabled={pending || page <= 1}
          aria-label="第一页"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => go(page - 1)}
          disabled={pending || page <= 1}
          aria-label="上一页"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-2">
          第 {page} / {totalPages} 页
        </span>
        <Button
          size="icon"
          variant="outline"
          onClick={() => go(page + 1)}
          disabled={pending || page >= totalPages}
          aria-label="下一页"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => go(totalPages)}
          disabled={pending || page >= totalPages}
          aria-label="最后一页"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}