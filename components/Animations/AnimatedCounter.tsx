/**
 * Animated Number Counter Component
 * Source: Document 2 - "Number Counter: 1.2s linear duration"
 */

"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";
import { DesignTokens } from "@/lib/DesignTokens";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";

export interface AnimatedCounterProps {
  value: number;
  duration?: number; // milliseconds
  decimals?: number;
  format?: "number" | "currency" | "percentage";
  suffix?: string;
  prefix?: string;
  currency?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedCounter({
  value,
  duration = 1200, // Source: Document 2 Line 199
  decimals = 0,
  format = "number",
  suffix = "",
  prefix = "",
  currency = "USD",
  className = "",
  style = {},
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<string>("0");

  const spring = useSpring(0, {
    duration: duration,
    bounce: 0,
  });

  const rounded = useTransform(spring, (latest) => {
    return Math.round(latest * 10 ** decimals) / 10 ** decimals;
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      let formatted: string;

      switch (format) {
        case "currency":
          formatted = formatCurrency(latest, currency);
          break;
        case "percentage":
          formatted = formatPercentage(latest, decimals);
          break;
        default:
          formatted = formatNumber(latest, decimals);
          break;
      }

      setDisplayValue(`${prefix}${formatted}${suffix}`);
    });

    return () => unsubscribe();
  }, [rounded, format, decimals, prefix, suffix, currency]);

  return (
    <motion.span
      className={className}
      style={{
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: parseFloat(DesignTokens.duration.medium) / 1000,
        ease: [0.23, 1, 0.32, 1], // elastic easing
      }}
    >
      {displayValue}
    </motion.span>
  );
}
