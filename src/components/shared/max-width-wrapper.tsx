import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const MaxWidthWrapper = ({
  maxWidth,
  className = "",
  autoMargin = true,
  children,
}: MaxWidthWrapperProps) => {
  return (
    <div
      className={cn(autoMargin && "mx-auto", className)}
      style={{ maxWidth: maxWidth }}
    >
      {children}
    </div>
  );
};

interface MaxWidthWrapperProps {
  maxWidth: string;
  className?: string;
  autoMargin?: boolean;
  children: ReactNode;
}
