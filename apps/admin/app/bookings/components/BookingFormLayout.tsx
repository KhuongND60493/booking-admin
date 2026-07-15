"use client";

import type { ReactNode } from "react";

export interface BookingFormLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  summary: ReactNode;
}

export function BookingFormLayout({ title, subtitle, actions, children, summary }: BookingFormLayoutProps) {
  return (
    <div>
      <div className="sticky top-0 z-20 bg-admin-bg border-b border-admin-border shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-heading text-xl font-bold text-admin-ink mb-0.5">{title}</h1>
            {subtitle && <p className="text-xs text-admin-muted">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2.5 shrink-0">{actions}</div>}
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="space-y-5 min-w-0">{children}</div>
          <div className="lg:sticky lg:top-[76px]">{summary}</div>
        </div>
      </div>
    </div>
  );
}
