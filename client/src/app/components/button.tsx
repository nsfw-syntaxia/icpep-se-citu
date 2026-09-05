'use client';

import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "primary2"
    | "primary3"
    | "secondary2"
    | "hero"
    | "heroOutline"
    | "danger"
    | "confirm"
    | "cancel";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "font-raleway font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all";

  const variantStyles = {
    primary: "rounded-[10px] bg-buttonbg1 border border-primary1 px-4 py-2 text-primary1 font-manrope hover:bg-primary1 hover:text-white focus-visible:ring-primary1 cursor-pointer",
    secondary: "bg-lavender rounded-lg text-primary1 px-4 py-2 hover:bg-primary2 hover:text-white focus-visible:ring-primary1 cursor-pointer",
    outline:
      "rounded-[10px] border border-2 border-primary1 text-primary1 hover:bg-primary1 hover:text-white focus-visible:ring-primary1 cursor-pointer",
    primary2: "bg-primary1 text-white font-medium text-sm sm:text-base px-8 py-2.5 rounded-2xl border border-transparent hover:bg-white hover:text-primary1 hover:border-primary1 active:scale-95 transition-all cursor-pointer",
    primary3: "bg-primary1 text-white font-medium text-sm sm:text-base px-8 py-2.5 rounded-2xl border border-transparent hover:bg-[var(--primary3)] hover:text-white hover:border-primary3 active:scale-95 transition-all cursor-pointer",
    secondary2: "bg-lavender border border-primary1 rounded-lg text-primary1 px-4 py-2 hover:bg-primary3 hover:text-white focus-visible:ring-primary1 cursor-pointer",
    // Solid pill CTA, matches the home hero "Join Community" button
    hero: "bg-primary1 hover:bg-primary2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none text-white font-raleway font-semibold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer",
    // Outline pill CTA, matches the home hero "Learn More" button
    heroOutline: "bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-buttonbg1 hover:border-primary1 hover:text-primary1 font-raleway font-semibold px-8 py-3 rounded-full transition-all duration-300 cursor-pointer",
    // Destructive action (e.g. "Delete", "Yes, Delete")
    danger: "bg-red-500 hover:bg-red-600 text-white font-rubik font-semibold rounded-xl shadow-lg shadow-red-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
    // Positive confirm/save action within compact editing UIs
    confirm: "bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 disabled:shadow-gray-200 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-white font-rubik font-bold rounded-xl shadow-md shadow-sky-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
    // Neutral "Cancel" action
    cancel: "bg-white border border-gray-200 text-gray-600 font-rubik font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 cursor-pointer",
};

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;


/*<Button> Default </Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline" size="lg">
  Outline Large
</Button>*/
