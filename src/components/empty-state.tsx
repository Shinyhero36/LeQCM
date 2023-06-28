import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export const EmptyState = ({
  title,
  description,
  className,
  actions,
  ...rest
}: EmptyStateProps) => (
  <div className={cn("h-96 rounded-xl border-4 border-dashed", className)}>
    <div
      className="mx-auto flex h-full max-w-sm flex-col items-center justify-center space-y-8"
      {...rest}
    >
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-medium">{title}</h2>
        <p className="text-sm text-cod-700">{description}</p>
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  </div>
);
