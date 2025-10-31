"use client";

import { motion } from "framer-motion";
import {
  Factory,
  Package,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { GlassContainer } from "@/components/GlassContainer";
import { DesignTokens } from "@/lib/DesignTokens";

/**
 * Glassmorphic vs Standard Design Comparison
 * Source: User request - "show me an example without the Glassmorphic"
 * Mode: Creative (demonstrating design alternatives)
 */

// Standard Card Component (No Glassmorphic Effects)
interface StandardCardProps {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  variant?: "solid" | "outlined" | "minimal";
}

function StandardCard({
  label,
  value,
  change,
  icon,
  variant = "solid",
}: StandardCardProps) {
  const isPositive = change >= 0;

  const variantStyles = {
    solid: {
      background: DesignTokens.theme.dark.background.secondary,
      border: `1px solid ${DesignTokens.borderColor.dark.base}`,
    },
    outlined: {
      background: "transparent",
      border: `2px solid ${DesignTokens.borderColor.dark.focus}`,
    },
    minimal: {
      background: DesignTokens.theme.dark.background.primary,
      border: "none",
      borderLeft: `4px solid ${DesignTokens.theme.dark.accent.emerald.from}`,
    },
  };

  return (
    <motion.div
      className="p-6 rounded-lg transition-all duration-300 hover:scale-105"
      style={variantStyles[variant]}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-sm mb-2 font-medium uppercase tracking-wide"
            style={{ color: DesignTokens.theme.dark.text.secondary }}
          >
            {label}
          </p>
          <p
            className="text-3xl font-bold"
            style={{ color: DesignTokens.theme.dark.text.primary }}
          >
            {value}
          </p>
          <div
            className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded text-sm font-semibold"
            style={{
              background: isPositive
                ? "oklch(0.65 0.2 158 / 0.1)"
                : "oklch(0.58 0.23 25 / 0.1)",
              color: isPositive
                ? DesignTokens.theme.dark.status.success
                : DesignTokens.theme.dark.status.critical,
            }}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        <div
          className="opacity-70"
          style={{ color: DesignTokens.theme.dark.text.tertiary }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

// Standard Button Component (No Glassmorphic Effects)
interface StandardButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

function StandardButton({
  children,
  variant = "primary",
  size = "md",
  onClick,
}: StandardButtonProps) {
  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  const variantStyles = {
    primary: {
      background: DesignTokens.theme.dark.accent.emerald.from,
      color: "white",
      border: "none",
    },
    secondary: {
      background: DesignTokens.theme.dark.background.secondary,
      color: DesignTokens.theme.dark.text.primary,
      border: `1px solid ${DesignTokens.borderColor.dark.base}`,
    },
    outline: {
      background: "transparent",
      color: DesignTokens.theme.dark.accent.emerald.from,
      border: `2px solid ${DesignTokens.theme.dark.accent.emerald.from}`,
    },
    ghost: {
      background: "transparent",
      color: DesignTokens.theme.dark.text.primary,
      border: "none",
    },
  };

  return (
    <motion.button
      className={`rounded-lg font-semibold transition-all duration-200 ${sizeStyles[size]}`}
      style={variantStyles[variant]}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

export default function ComparisonDemo() {
  const sampleData = {
    label: "Active Materials",
    value: "24.5K",
    change: 12.5,
    icon: <Package size={32} />,
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: DesignTokens.theme.dark.background.primary,
        fontFamily: DesignTokens.typography.fontFamily.sans,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: DesignTokens.theme.dark.text.primary }}
          >
            Design Comparison
          </h1>
          <p
            className="text-lg"
            style={{ color: DesignTokens.theme.dark.text.secondary }}
          >
            Glassmorphic vs Standard Design Elements
          </p>
        </div>

        {/* Cards Comparison */}
        <section className="mb-16">
          <h2
            className="text-2xl font-semibold mb-8"
            style={{ color: DesignTokens.theme.dark.text.primary }}
          >
            Metric Cards Comparison
          </h2>

          {/* Glassmorphic Cards Row */}
          <div className="mb-8">
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: DesignTokens.theme.dark.text.secondary }}
            >
              ✨ Glassmorphic Cards (Current)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassContainer
                glassIntensity="medium"
                glowEffect="emerald"
                className="p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm mb-2 font-medium uppercase tracking-wide"
                      style={{ color: DesignTokens.theme.dark.text.secondary }}
                    >
                      {sampleData.label}
                    </p>
                    <p
                      className="text-3xl font-bold"
                      style={{ color: DesignTokens.theme.dark.text.primary }}
                    >
                      {sampleData.value}
                    </p>
                    <div
                      className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded text-sm font-semibold"
                      style={{
                        background: "oklch(0.65 0.2 158 / 0.1)",
                        color: DesignTokens.theme.dark.status.success,
                      }}
                    >
                      <TrendingUp size={14} />
                      <span>{sampleData.change}%</span>
                    </div>
                  </div>
                  <div className="opacity-80">{sampleData.icon}</div>
                </div>
              </GlassContainer>

              <GlassContainer
                glassIntensity="medium"
                glowEffect="violet"
                className="p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm mb-2 font-medium uppercase tracking-wide"
                      style={{ color: DesignTokens.theme.dark.text.secondary }}
                    >
                      Workforce
                    </p>
                    <p
                      className="text-3xl font-bold"
                      style={{ color: DesignTokens.theme.dark.text.primary }}
                    >
                      156
                    </p>
                    <div
                      className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded text-sm font-semibold"
                      style={{
                        background: "oklch(0.65 0.2 158 / 0.1)",
                        color: DesignTokens.theme.dark.status.success,
                      }}
                    >
                      <TrendingUp size={14} />
                      <span>8.2%</span>
                    </div>
                  </div>
                  <div className="opacity-80">
                    <Users size={32} />
                  </div>
                </div>
              </GlassContainer>
            </div>
          </div>

          {/* Standard Cards Row */}
          <div>
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: DesignTokens.theme.dark.text.secondary }}
            >
              🎯 Standard Cards (Alternative)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StandardCard {...sampleData} variant="solid" />
              <StandardCard
                label="Workforce"
                value="156"
                change={8.2}
                icon={<Users size={32} />}
                variant="outlined"
              />
              <StandardCard
                label="Equipment"
                value="23"
                change={-2.1}
                icon={<Factory size={32} />}
                variant="minimal"
              />
              <StandardCard
                label="Deliveries"
                value="89"
                change={15.7}
                icon={<Truck size={32} />}
                variant="solid"
              />
            </div>
          </div>
        </section>

        {/* Buttons Comparison */}
        <section>
          <h2
            className="text-2xl font-semibold mb-8"
            style={{ color: DesignTokens.theme.dark.text.primary }}
          >
            Buttons Comparison
          </h2>

          {/* Standard Buttons */}
          <div className="mb-8">
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: DesignTokens.theme.dark.text.secondary }}
            >
              🎯 Standard Buttons (No Glassmorphic)
            </h3>
            <div className="flex flex-wrap gap-4">
              <StandardButton variant="primary" size="md">
                Primary Action
              </StandardButton>
              <StandardButton variant="secondary" size="md">
                Secondary Action
              </StandardButton>
              <StandardButton variant="outline" size="md">
                Outlined Button
              </StandardButton>
              <StandardButton variant="ghost" size="md">
                Ghost Button
              </StandardButton>
            </div>
          </div>

          {/* Size Variations */}
          <div>
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: DesignTokens.theme.dark.text.secondary }}
            >
              📏 Size Variations
            </h3>
            <div className="flex items-center gap-4">
              <StandardButton variant="primary" size="sm">
                Small
              </StandardButton>
              <StandardButton variant="primary" size="md">
                Medium
              </StandardButton>
              <StandardButton variant="primary" size="lg">
                Large
              </StandardButton>
            </div>
          </div>
        </section>

        {/* Design Notes */}
        <section
          className="mt-16 p-6 rounded-lg"
          style={{
            background: DesignTokens.theme.dark.background.secondary,
            border: `1px solid ${DesignTokens.borderColor.dark.base}`,
          }}
        >
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: DesignTokens.theme.dark.text.primary }}
          >
            📝 Design Comparison Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4
                className="font-semibold mb-2"
                style={{ color: DesignTokens.theme.dark.accent.emerald.from }}
              >
                ✨ Glassmorphic Advantages
              </h4>
              <ul
                className="space-y-2 text-sm"
                style={{ color: DesignTokens.theme.dark.text.secondary }}
              >
                <li>• Premium, modern appearance</li>
                <li>• Depth and layering effects</li>
                <li>• Subtle animations and glow</li>
                <li>• Unique brand differentiation</li>
              </ul>
            </div>
            <div>
              <h4
                className="font-semibold mb-2"
                style={{ color: DesignTokens.theme.dark.accent.violet.from }}
              >
                🎯 Standard Advantages
              </h4>
              <ul
                className="space-y-2 text-sm"
                style={{ color: DesignTokens.theme.dark.text.secondary }}
              >
                <li>• Better accessibility contrast</li>
                <li>• Faster rendering performance</li>
                <li>• Simpler maintenance</li>
                <li>• Universal design patterns</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
