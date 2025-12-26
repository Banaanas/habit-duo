import { ReactNode } from "react";

export const MaxWidthWrapper = ({
  maxWidth,
  className = "",
  autoMargin = true,
  children,
}: MaxWidthWrapperProps) => {
  return (
    <div
      className={`${autoMargin ? "mx-auto" : ""} size-full ${className}`}
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
