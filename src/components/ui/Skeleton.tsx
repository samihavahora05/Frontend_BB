import React from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-slate-100",
        "bg-gradient-to-r from-slate-100 via-slate-200/60 to-slate-100",
        "bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col gap-4", className)}>
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-4 px-6 border-b border-slate-50 last:border-0 w-full">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className={i === 0 ? "flex-1 min-w-[200px]" : "w-32"}>
          <Skeleton className="h-4 w-3/4 mb-2" />
          {i === 0 && <Skeleton className="h-3 w-1/2" />}
        </div>
      ))}
    </div>
  );
}
