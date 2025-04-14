interface ButtonProps {
  children: React.ReactNode;
  type: "submit" | "button";
  className?: string;
}

export default function Button({
  children,
  type,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
