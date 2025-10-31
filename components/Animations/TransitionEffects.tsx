/**
 * Transition and Entrance Animation Components
 * Source: Document 2 - "Entrance Animations" section
 */

"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import React from "react";
import { DesignTokens } from "@/lib/DesignTokens";

// Source: Document 2 Lines 190-192
// Fade + Scale: Duration 400ms, easing: cubic-bezier(0.23, 1, 0.320, 1)

export interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number; // milliseconds
  duration?: number; // milliseconds
}

export function FadeIn({
  children,
  delay = 0,
  duration = 400, // Source: Document 2 Line 190
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: [0.23, 1, 0.32, 1], // Source: Document 2 Line 192
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface SlideInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
}

export function SlideIn({
  children,
  direction = "up",
  delay = 0,
  duration = 400,
  ...props
}: SlideInProps) {
  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: [0.23, 1, 0.32, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Source: Document 2 Line 191 - "Stagger effect: 50ms between cards"
export interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  staggerDelay?: number; // milliseconds between children
}

export function StaggerContainer({
  children,
  staggerDelay = 50, // Source: Document 2 Line 191
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay / 1000,
          },
        },
      }}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return child;
        }

        // Use existing key or generate stable identifier
        const childKey = child.key ?? `stagger-child-${index}`;

        return (
          <motion.div
            key={childKey}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{
              duration: parseFloat(DesignTokens.duration.medium) / 1000,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
