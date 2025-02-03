"use client";

import { ReactNode } from "react";

export function KanbanBoard({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {children}
    </div>
  );
}

export function KanbanColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-80 min-w-[300px] bg-muted/50 rounded-lg p-4">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
} 