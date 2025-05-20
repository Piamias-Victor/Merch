import React from "react";
import { cn } from "@/lib/utils";

interface PharmacyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "link";
  size?: "default" | "lg" | "sm";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export default function PharmacyButton({
  className,
  children,
  variant = "primary",
  size = "default",
  iconLeft,
  iconRight,
  ...props
}: PharmacyButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    primary: "bg-[#0A5B91] text-white hover:bg-[#084c78] shadow-sm",
    outline: "border border-[#0A5B91] text-[#0A5B91] hover:bg-[#0A5B91]/5",
    link: "text-[#0A5B91] hover:underline p-0 shadow-none"
  };
  
  const sizeClasses = {
    default: "h-10 px-4 py-2 rounded-md text-sm",
    sm: "h-9 px-3 rounded-md text-xs",
    lg: "h-12 px-6 rounded-md text-base"
  };
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
}