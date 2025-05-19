import { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface XInputHomeProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function XInputHome({ className, ...props }: XInputHomeProps) {
  return (
    <input
      {...props}
      className={clsx(
        "border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500",
        className
      )}
    />
  );
}