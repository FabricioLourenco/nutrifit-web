import { ReactNode } from "react";
import clsx from "clsx";

interface XCardHomeProps {
  children: ReactNode;
  className?: string;
}

export function XCardHome({ children, className }: XCardHomeProps) {
  return (
    <div className={clsx("bg-white shadow rounded-md overflow-hidden", className)}>
      {children}
    </div>
  );
}
