/**
 * OPS Design System - Theme Components
 * Styled components using the theme system
 * Created: October 29, 2025
 */

"use client";

import {
  type ButtonHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
} from "react";
import { useTheme } from "./provider";

// Button component with theme variants
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", className = "", children, ...props },
    ref,
  ) => {
    const { tokens } = useTheme();

    const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2
    focus:ring-offset-2 focus:ring-offset-transparent
  `;

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const variantStyles = {
      primary: `
      text-white shadow-lg hover:shadow-xl
      focus:ring-2 focus:ring-blue-500
    `,
      secondary: `
      text-white shadow-md hover:shadow-lg
      focus:ring-2 focus:ring-purple-500
    `,
      ghost: `
      text-white hover:bg-white/10
      focus:ring-2 focus:ring-white/20
    `,
      glass: `
      text-white backdrop-blur-lg
      border border-white/20 hover:border-white/30
      focus:ring-2 focus:ring-white/30
    `,
    };

    const getBackgroundStyle = () => {
      switch (variant) {
        case "primary":
          return { background: tokens.colors.gradients.primary };
        case "secondary":
          return { background: tokens.colors.gradients.rainbow };
        case "ghost":
          return {};
        case "glass":
          return { background: tokens.colors.glass.medium };
        default:
          return { background: tokens.colors.gradients.primary };
      }
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        style={getBackgroundStyle()}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

// Card component with glass morphism
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "elevated" | "bordered";
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = "glass", hover = false, className = "", children, ...props },
    ref,
  ) => {
    const { tokens } = useTheme();

    const baseStyles = `
    rounded-2xl p-6 transition-all duration-300
    ${hover ? "hover:scale-105 cursor-pointer" : ""}
  `;

    const getVariantStyles = () => {
      switch (variant) {
        case "glass":
          return {
            background: tokens.colors.glass.medium,
            border: `1px solid ${tokens.colors.borders.light}`,
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px oklch(0% 0 none / 0.1)",
          };
        case "elevated":
          return {
            background: tokens.colors.brand.surfaceElevated,
            boxShadow: "0 20px 40px oklch(0% 0 none / 0.2)",
          };
        case "bordered":
          return {
            background: tokens.colors.brand.surface,
            border: `1px solid ${tokens.colors.borders.medium}`,
          };
        default:
          return {};
      }
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${className}`}
        style={getVariantStyles()}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

// Gradient Text component
interface GradientTextProps extends HTMLAttributes<HTMLElement> {
  gradient?: "primary" | "rainbow";
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}

export function GradientText({
  gradient = "primary",
  as: Component = "span",
  className = "",
  children,
  style,
  ...props
}: GradientTextProps) {
  const { tokens } = useTheme();

  const gradientStyle = {
    background: tokens.colors.gradients[gradient],
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    ...style,
  };

  return (
    <Component
      className={`font-bold ${className}`}
      style={gradientStyle}
      {...props}
    >
      {children}
    </Component>
  );
}

GradientText.displayName = "GradientText";

// Container with theme-aware styling
interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  center?: boolean;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    { size = "lg", center = false, className = "", children, ...props },
    ref,
  ) => {
    const sizeStyles = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-4xl",
      xl: "max-w-6xl",
      full: "max-w-full",
    };

    const baseStyles = `
    w-full px-4
    ${center ? "mx-auto" : ""}
    ${sizeStyles[size]}
  `;

    return (
      <div ref={ref} className={`${baseStyles} ${className}`} {...props}>
        {children}
      </div>
    );
  },
);

Container.displayName = "Container";

// Theme Switcher Component
export function ThemeSwitcher() {
  const { variant, setVariant, isDark, toggleDarkMode } = useTheme();

  const variants = [
    { id: "cosmic", name: "Cosmic", emoji: "🌌" },
    { id: "aurora", name: "Aurora", emoji: "🌅" },
    { id: "nebula", name: "Nebula", emoji: "🌠" },
    { id: "void", name: "Void", emoji: "🕳️" },
  ] as const;

  return (
    <Card variant="glass" className="w-fit">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Theme Settings</h3>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="text-white/60 hover:text-white transition-colors"
          >
            {isDark ? "🌙" : "☀️"}
          </button>
        </div>

        <div className="flex gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariant(v.id)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  variant === v.id
                    ? "bg-white/20 text-white scale-105"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <span className="mr-2">{v.emoji}</span>
              {v.name}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
