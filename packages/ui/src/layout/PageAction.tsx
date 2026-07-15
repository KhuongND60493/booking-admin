import type React from "react";
import { cn } from "../lib/cn";

export const PageActionContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`flex items-start justify-between`, className)}>
      {children}
    </div>
  );
};

export const PageActionGroup = ({
  children,
  className,
  noWrap,
}: {
  children: React.ReactNode;
  className?: string;
  noWrap?: boolean;
}) => {
  return (
    <div
      className={cn(
        `flex flex-wrap items-start justify-start gap-2 whitespace-nowrap`,
        noWrap && "flex-nowrap",
        className
      )}
    >
      {children}
    </div>
  );
};
