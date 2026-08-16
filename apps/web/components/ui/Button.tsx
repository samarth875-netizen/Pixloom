import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "black" | "yellow" | "outline" | "outline-white" | "white";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "black", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F547] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none";

    const variantStyles = {
      black: "bg-black text-white hover:bg-black/85 shadow-sm",
      yellow: "bg-[#F5F547] text-black font-bold hover:brightness-105 shadow-md shadow-[#F5F547]/10",
      outline: "border-2 border-black text-black bg-transparent hover:bg-black/5",
      "outline-white": "border border-white/20 text-white bg-transparent hover:bg-white/10 hover:border-white/40",
      white: "bg-white text-black font-semibold hover:bg-neutral-100 shadow-sm",
    };

    const sizeStyles = {
      sm: "text-xs px-4 py-2 gap-1.5",
      md: "text-sm px-6 py-3 gap-2",
      lg: "text-base px-8 py-3.5 gap-2.5 font-bold",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
