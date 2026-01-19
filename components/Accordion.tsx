"use client";

import { useState } from "react";

export function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-neutral-500">{open ? "▲" : "▼"}</span>
      </button>

      <div
        className={[
          "overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
          open ? "max-h-125 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="px-4 pb-4 text-sm text-neutral-600">{children}</div>
      </div>
    </div>
  );
}
