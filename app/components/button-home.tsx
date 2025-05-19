import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface XButtonHomeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function XButtonHome({ className, children, ...props }: XButtonHomeProps) {
  return (
    <button
      {...props}
      className={clsx(
        "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        className
      )}
    >
      {children}
    </button>
  );
}
