/** biome-ignore-all lint/a11y/useSemanticElements: demo page with complex layout */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: demo data with stable array indices */
"use client";

import {
  Box,
  Check,
  Circle,
  Clock,
  Copy,
  Eye,
  Layers,
  Layout,
  Moon,
  Move,
  Palette,
  Shapes,
  Sparkles,
  Stars,
  Sun,
  Type,
  Wand2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { DarkTheme, DesignTokens, LightTheme } from "@/lib/DesignTokens";

type TabId =
  | "colors"
  | "typography"
  | "spacing"
  | "effects"
  | "animations"
  | "components";

export default function DesignSystemShowcase() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("colors");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Get current theme object
  const currentTheme = theme === "dark" ? DarkTheme : LightTheme;

  // Toggle theme with keyboard support
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div
      className="min-h-screen p-4 md:p-8 transition-colors duration-300"
      style={{ background: currentTheme.background.primary }}
    >
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div
          className="glass-container text-center p-8 md:p-12"
          style={{
            background: currentTheme.background.glass,
            backdropFilter: DesignTokens.helpers.composeBackdropFilter("md"),
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wand2
              className="w-12 h-12"
              style={{ color: currentTheme.accent.emerald.from }}
            />
            <h1
              className="text-4xl md:text-6xl font-bold"
              style={{
                background: DesignTokens.gradient.primary.css,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              DeskOps Design System
            </h1>
          </div>
          <p
            className="text-lg md:text-xl mb-6"
            style={{ color: currentTheme.text.secondary }}
          >
            Comprehensive Design Token Showcase & Implementation Guide
          </p>

          {/* Theme Toggle Button - WCAG 2.1 AA Compliant */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            <button
              type="button"
              onClick={toggleTheme}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleTheme();
                }
              }}
              className="flex items-center gap-3 px-6 py-3 rounded-lg transition-all hover:scale-105 focus:scale-105"
              style={{
                background: currentTheme.background.tertiary,
                border: `2px solid ${DesignTokens.borderColor.dark.base}`,
                color: currentTheme.text.primary,
                cursor: "pointer",
              }}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              aria-checked={theme === "light"}
              role="switch"
              tabIndex={0}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium">Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium">Switch to Dark Mode</span>
                </>
              )}
            </button>

            <output
              className="px-4 py-2 rounded-lg"
              style={{
                background: currentTheme.background.secondary,
                border: `1px solid ${DesignTokens.borderColor.dark.base}`,
              }}
              aria-live="polite"
            >
              <span style={{ color: currentTheme.text.secondary }}>
                Current:{" "}
                <strong style={{ color: currentTheme.text.primary }}>
                  {theme === "dark" ? "Dark" : "Light"} Theme
                </strong>
              </span>
            </output>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Stars
                className="w-4 h-4"
                style={{ color: currentTheme.status.success }}
              />
              <span style={{ color: currentTheme.text.tertiary }}>
                OKLCH Color Space
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles
                className="w-4 h-4"
                style={{ color: currentTheme.accent.violet.from }}
              />
              <span style={{ color: currentTheme.text.tertiary }}>
                Glass Morphism
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap
                className="w-4 h-4"
                style={{ color: currentTheme.status.warning }}
              />
              <span style={{ color: currentTheme.text.tertiary }}>
                WCAG 2.1 AA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div
          className="glass-container p-2 flex flex-wrap gap-2"
          style={{ background: currentTheme.background.glass }}
          role="tablist"
          aria-label="Design system sections"
        >
          {[
            { id: "colors", label: "Colors", icon: Palette },
            { id: "typography", label: "Typography", icon: Type },
            { id: "spacing", label: "Spacing", icon: Box },
            { id: "effects", label: "Effects", icon: Sparkles },
            { id: "animations", label: "Animations", icon: Zap },
            { id: "components", label: "Components", icon: Layers },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveTab(tab.id as TabId);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all focus:outline-none focus:ring-2"
              style={{
                background:
                  activeTab === tab.id
                    ? currentTheme.background.tertiary
                    : "transparent",
                color:
                  activeTab === tab.id
                    ? currentTheme.text.primary
                    : currentTheme.text.secondary,
                border: `1px solid ${activeTab === tab.id ? DesignTokens.borderColor.dark.hover : "transparent"}`,
                outline: "none",
                boxShadow:
                  activeTab === tab.id
                    ? `0 0 0 2px ${currentTheme.status.success}`
                    : "none",
              }}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              <tab.icon className="w-4 h-4" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto">
        {/* COLORS SECTION */}
        {activeTab === "colors" && (
          <div
            className="space-y-8 fade-in"
            id="colors-panel"
            role="tabpanel"
            aria-labelledby="colors-tab"
          >
            {/* Theme Colors */}
            <Section title="Theme Colors" icon={Palette} theme={currentTheme}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorGroup
                  title="Background"
                  colors={[
                    {
                      label: "Primary",
                      value: currentTheme.background.primary,
                      key: `${theme}Theme.background.primary`,
                    },
                    {
                      label: "Secondary",
                      value: currentTheme.background.secondary,
                      key: `${theme}Theme.background.secondary`,
                    },
                    {
                      label: "Tertiary",
                      value: currentTheme.background.tertiary,
                      key: `${theme}Theme.background.tertiary`,
                    },
                    {
                      label: "Glass",
                      value: currentTheme.background.glass,
                      key: `${theme}Theme.background.glass`,
                    },
                  ]}
                  onCopy={copyToClipboard}
                  copied={copiedToken}
                  theme={currentTheme}
                />

                <ColorGroup
                  title="Text"
                  colors={[
                    {
                      label: "Primary",
                      value: currentTheme.text.primary,
                      key: `${theme}Theme.text.primary`,
                    },
                    {
                      label: "Secondary",
                      value: currentTheme.text.secondary,
                      key: `${theme}Theme.text.secondary`,
                    },
                    {
                      label: "Tertiary",
                      value: currentTheme.text.tertiary,
                      key: `${theme}Theme.text.tertiary`,
                    },
                    {
                      label: "Interactive",
                      value: currentTheme.text.interactive,
                      key: `${theme}Theme.text.interactive`,
                    },
                  ]}
                  onCopy={copyToClipboard}
                  copied={copiedToken}
                  theme={currentTheme}
                />
              </div>

              {/* Accent Colors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <GradientCard
                  title="Emerald Accent"
                  gradient={DesignTokens.gradient.primary.css}
                  from={currentTheme.accent.emerald.from}
                  to={currentTheme.accent.emerald.to}
                  keyPath={`${theme}Theme.accent.emerald`}
                  onCopy={copyToClipboard}
                  theme={currentTheme}
                />
                <GradientCard
                  title="Violet Accent"
                  gradient={DesignTokens.gradient.secondary.css}
                  from={currentTheme.accent.violet.from}
                  to={currentTheme.accent.violet.to}
                  keyPath={`${theme}Theme.accent.violet`}
                  onCopy={copyToClipboard}
                  theme={currentTheme}
                />
                <GradientCard
                  title="Orange Accent"
                  gradient={DesignTokens.gradient.tertiary.css}
                  from={currentTheme.accent.orange.from}
                  to={currentTheme.accent.orange.to}
                  keyPath={`${theme}Theme.accent.orange`}
                  onCopy={copyToClipboard}
                  theme={currentTheme}
                />
              </div>

              {/* Status Colors */}
              <ColorGroup
                title="Status Colors"
                colors={[
                  {
                    label: "Success",
                    value: currentTheme.status.success,
                    key: `${theme}Theme.status.success`,
                  },
                  {
                    label: "Warning",
                    value: currentTheme.status.warning,
                    key: `${theme}Theme.status.warning`,
                  },
                  {
                    label: "Critical",
                    value: currentTheme.status.critical,
                    key: `${theme}Theme.status.critical`,
                  },
                  {
                    label: "Info",
                    value: currentTheme.status.info,
                    key: `${theme}Theme.status.info`,
                  },
                ]}
                onCopy={copyToClipboard}
                copied={copiedToken}
                theme={currentTheme}
              />

              {/* All Gradients */}
              <div className="mt-6">
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: currentTheme.text.primary }}
                >
                  Complete Gradient Collection
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(DesignTokens.gradient).map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      className="glass-container cursor-pointer hover:scale-105 transition-transform focus:outline-none focus:ring-2"
                      onClick={() => copyToClipboard(value.css, key)}
                      style={{ background: currentTheme.background.glass }}
                      aria-label={`Copy ${key} gradient`}
                    >
                      <div
                        className="h-24 rounded-lg mb-2"
                        style={{ background: value.css }}
                      />
                      <p
                        className="text-sm font-medium"
                        style={{ color: currentTheme.text.primary }}
                      >
                        {key}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: currentTheme.text.tertiary }}
                      >
                        {copiedToken === key ? (
                          <Check
                            className="w-3 h-3 inline"
                            aria-hidden="true"
                          />
                        ) : (
                          <Copy className="w-3 h-3 inline" aria-hidden="true" />
                        )}{" "}
                        Click to copy
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        )}
        {/* TYPOGRAPHY SECTION */} {/* TYPOGRAPHY SECTION */}
        {activeTab === "typography" && (
          <div className="space-y-8 fade-in">
            <Section title="Font Sizes" icon={Type} theme={currentTheme}>
              <div className="space-y-4">
                {Object.entries(DesignTokens.typography.fontSize).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="glass-container flex items-center justify-between p-4 cursor-pointer hover:scale-[1.01] transition-transform"
                      onClick={() => copyToClipboard(value, `FontSize.${key}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          copyToClipboard(value, `FontSize.${key}`);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      style={{ background: currentTheme.background.glass }}
                    >
                      <div className="flex-1">
                        <p
                          style={{
                            fontSize: value,
                            color: currentTheme.text.primary,
                            fontWeight:
                              DesignTokens.typography.fontWeight.semibold,
                          }}
                        >
                          The quick brown fox jumps
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p
                          className="text-sm font-mono"
                          style={{ color: currentTheme.text.secondary }}
                        >
                          {key}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: currentTheme.text.tertiary }}
                        >
                          {value}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </Section>

            <Section title="Font Weights" icon={Type} theme={currentTheme}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(DesignTokens.typography.fontWeight).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="glass-container p-6 text-center cursor-pointer hover:scale-105 transition-transform"
                      onClick={() =>
                        copyToClipboard(String(value), `FontWeight.${key}`)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          copyToClipboard(String(value), `FontWeight.${key}`);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      style={{ background: currentTheme.background.glass }}
                    >
                      <p
                        className="text-2xl mb-2"
                        style={{
                          fontWeight: value,
                          color: currentTheme.text.primary,
                        }}
                      >
                        Aa
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: currentTheme.text.secondary }}
                      >
                        {key}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: currentTheme.text.tertiary }}
                      >
                        {value}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </Section>

            <Section title="Line Heights" icon={Type} theme={currentTheme}>
              <div className="space-y-4">
                {Object.entries(DesignTokens.typography.lineHeight).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="glass-container p-4 cursor-pointer hover:scale-[1.01] transition-transform"
                      onClick={() =>
                        copyToClipboard(String(value), `LineHeight.${key}`)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          copyToClipboard(String(value), `LineHeight.${key}`);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      style={{ background: currentTheme.background.glass }}
                    >
                      <div className="flex items-start justify-between">
                        <p
                          style={{
                            lineHeight:
                              typeof value === "number" ? value : value,
                            color: currentTheme.text.primary,
                            maxWidth: "70%",
                          }}
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>
                        <div className="text-right">
                          <p
                            className="text-sm font-mono"
                            style={{ color: currentTheme.text.secondary }}
                          >
                            {key}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: currentTheme.text.tertiary }}
                          >
                            {String(value)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </Section>
          </div>
        )}
        {/* SPACING SECTION */}
        {activeTab === "spacing" && (
          <div className="space-y-8 fade-in">
            <Section title="Spacing Scale" icon={Box} theme={currentTheme}>
              <div className="space-y-3">
                {Object.entries(DesignTokens.spacing).map(([key, value]) => (
                  <div
                    key={key}
                    className="glass-container p-4 cursor-pointer hover:scale-[1.01] transition-transform"
                    onClick={() => copyToClipboard(value, `Spacing[${key}]`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        copyToClipboard(value, `Spacing[${key}]`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    style={{ background: currentTheme.background.glass }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="rounded"
                        style={{
                          width: value,
                          height: "24px",
                          background: DesignTokens.gradient.primary.css,
                        }}
                      />
                      <div className="flex-1">
                        <p
                          className="text-sm font-mono"
                          style={{ color: currentTheme.text.secondary }}
                        >
                          Spacing["{key}"]
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: currentTheme.text.tertiary }}
                        >
                          {value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Border Radius" icon={Circle} theme={currentTheme}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(DesignTokens.borderRadius).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="glass-container p-6 text-center cursor-pointer hover:scale-105 transition-transform"
                      onClick={() =>
                        copyToClipboard(value, `BorderRadius.${key}`)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          copyToClipboard(value, `BorderRadius.${key}`);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      style={{ background: currentTheme.background.glass }}
                    >
                      <div
                        className="w-20 h-20 mx-auto mb-3"
                        style={{
                          borderRadius: value,
                          background: DesignTokens.gradient.secondary.css,
                        }}
                      />
                      <p
                        className="text-sm font-mono"
                        style={{ color: currentTheme.text.secondary }}
                      >
                        {key}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: currentTheme.text.tertiary }}
                      >
                        {value}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </Section>

            <Section title="Grid System" icon={Layout} theme={currentTheme}>
              <div
                className="glass-container p-6"
                style={{ background: currentTheme.background.glass }}
              >
                <div className="space-y-4">
                  {[1, 2, 3, 4, 6, 12].map((cols) => (
                    <div key={cols}>
                      <p
                        className="text-sm mb-2"
                        style={{ color: currentTheme.text.secondary }}
                      >
                        {cols} Columns
                      </p>
                      <div
                        className="grid gap-2"
                        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                      >
                        {Array.from({ length: cols }).map((_, i) => (
                          <div
                            key={`col-${cols}-${i}`}
                            className="h-16 rounded"
                            style={{
                              background: `linear-gradient(135deg, ${currentTheme.accent.emerald.from}, ${currentTheme.accent.violet.from})`,
                              opacity: 0.6 + (i * 0.4) / cols,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        )}
        {/* EFFECTS SECTION */}
        {activeTab === "effects" && (
          <div className="space-y-8 fade-in">
            <Section title="Box Shadows" icon={Sparkles} theme={currentTheme}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(DesignTokens.boxShadow).map(([key, value]) => {
                  if (typeof value === "object") return null;
                  return (
                    <div
                      key={key}
                      className="glass-container p-6 text-center cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => copyToClipboard(value, `BoxShadow.${key}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          copyToClipboard(value, `BoxShadow.${key}`);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      style={{
                        background: currentTheme.background.tertiary,
                        boxShadow: value,
                      }}
                    >
                      <div
                        className="w-16 h-16 mx-auto mb-3 rounded-xl"
                        style={{
                          background: DesignTokens.gradient.primary.css,
                        }}
                      />
                      <p
                        className="text-sm font-mono"
                        style={{ color: currentTheme.text.secondary }}
                      >
                        {key}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="Glow Effects" icon={Stars} theme={currentTheme}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["glowEmerald", "glowViolet", "glowAmber", "glowCritical"].map(
                  (key) => (
                    <div
                      key={key}
                      className="glass-container p-8 text-center cursor-pointer hover:scale-110 transition-transform"
                      onClick={() =>
                        copyToClipboard(
                          DesignTokens.boxShadow[
                            key as keyof typeof DesignTokens.boxShadow
                          ] as string,
                          `BoxShadow.${key}`,
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          copyToClipboard(
                            DesignTokens.boxShadow[
                              key as keyof typeof DesignTokens.boxShadow
                            ] as string,
                            `BoxShadow.${key}`,
                          );
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      style={{
                        background: currentTheme.background.tertiary,
                        boxShadow: DesignTokens.boxShadow[
                          key as keyof typeof DesignTokens.boxShadow
                        ] as string,
                      }}
                    >
                      <Stars
                        className="w-10 h-10 mx-auto"
                        style={{ color: currentTheme.text.primary }}
                      />
                      <p
                        className="text-sm mt-3"
                        style={{ color: currentTheme.text.secondary }}
                      >
                        {key}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </Section>

            <Section title="Backdrop Blur" icon={Eye} theme={currentTheme}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(DesignTokens.backdropBlur).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="relative overflow-hidden rounded-xl h-40 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() =>
                        copyToClipboard(value, `BackdropBlur.${key}`)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          copyToClipboard(value, `BackdropBlur.${key}`);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background: DesignTokens.gradient.rainbow.css,
                        }}
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          backdropFilter: value,
                          WebkitBackdropFilter: value,
                          background: "oklch(1 0 0 / 0.1)",
                        }}
                      >
                        <div className="text-center">
                          <p
                            className="text-sm font-mono"
                            style={{ color: currentTheme.text.primary }}
                          >
                            {key}
                          </p>
                          <p
                            className="text-xs mt-1"
                            style={{ color: currentTheme.text.secondary }}
                          >
                            {value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </Section>

            <Section title="Opacity Levels" icon={Circle} theme={currentTheme}>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {Object.entries(DesignTokens.opacity).map(([key, value]) => (
                  <div
                    key={key}
                    className="text-center cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => copyToClipboard(value, `Opacity[${key}]`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        copyToClipboard(value, `Opacity[${key}]`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div
                      className="w-full aspect-square rounded-lg mb-2"
                      style={{
                        background: currentTheme.accent.emerald.from,
                        opacity: value,
                      }}
                    />
                    <p
                      className="text-xs"
                      style={{ color: currentTheme.text.tertiary }}
                    >
                      {key}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: currentTheme.text.tertiary }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}
        {/* ANIMATIONS SECTION */}
        {activeTab === "animations" && (
          <div className="space-y-8 fade-in">
            <Section
              title="Animation Durations"
              icon={Clock}
              theme={currentTheme}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(DesignTokens.duration).map(([key, value]) => (
                  <div
                    key={key}
                    className="glass-container p-6 text-center cursor-pointer group"
                    onClick={() => copyToClipboard(value, `Duration.${key}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        copyToClipboard(value, `Duration.${key}`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    style={{ background: currentTheme.background.glass }}
                  >
                    <div
                      className="w-16 h-16 mx-auto mb-3 rounded-full animate-pulse"
                      style={{
                        background: DesignTokens.gradient.primary.css,
                        animationDuration: value,
                      }}
                    />
                    <p
                      className="text-sm font-mono"
                      style={{ color: currentTheme.text.secondary }}
                    >
                      {key}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: currentTheme.text.tertiary }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Animation Easings" icon={Move} theme={currentTheme}>
              <div className="space-y-4">
                {Object.entries(DesignTokens.easing).map(([key, value]) => (
                  <div
                    key={key}
                    className="glass-container p-4 cursor-pointer hover:scale-[1.01] group"
                    onClick={() => copyToClipboard(value, `Easing.${key}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        copyToClipboard(value, `Easing.${key}`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    style={{ background: currentTheme.background.glass }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-12 h-12 rounded-lg group-hover:translate-x-20"
                          style={{
                            background: DesignTokens.gradient.secondary.css,
                            transition: `transform 1s ${value}`,
                          }}
                        />
                        <div>
                          <p
                            className="text-sm font-mono"
                            style={{ color: currentTheme.text.secondary }}
                          >
                            {key}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: currentTheme.text.tertiary }}
                          >
                            {value}
                          </p>
                        </div>
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: currentTheme.text.tertiary }}
                      >
                        Hover to preview
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              title="Scale Transforms"
              icon={Shapes}
              theme={currentTheme}
            >
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(DesignTokens.scale).map(([key, value]) => {
                  if (typeof value !== "string" && typeof value !== "number")
                    return null;
                  const scaleValue =
                    typeof value === "string" ? value : String(value);
                  return (
                    <div
                      key={key}
                      className="glass-container p-6 text-center cursor-pointer hover:scale-110 transition-transform"
                      onClick={() =>
                        copyToClipboard(scaleValue, `Scale.${key}`)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          copyToClipboard(scaleValue, `Scale.${key}`);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      style={{ background: currentTheme.background.glass }}
                    >
                      <div
                        className="w-16 h-16 mx-auto mb-3 rounded-lg transition-transform"
                        style={{
                          background: DesignTokens.gradient.tertiary.css,
                          transform: `scale(${scaleValue})`,
                        }}
                      />
                      <p
                        className="text-xs font-mono"
                        style={{ color: currentTheme.text.secondary }}
                      >
                        {key}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: currentTheme.text.tertiary }}
                      >
                        {scaleValue}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>
        )}{" "}
        {/* COMPONENTS SECTION */}
        {activeTab === "components" && (
          <div className="space-y-8 fade-in">
            <Section title="Button Variants" icon={Zap} theme={currentTheme}>
              <div className="space-y-6">
                <div
                  className="glass-container p-6"
                  style={{ background: currentTheme.background.glass }}
                >
                  <h4
                    className="text-sm mb-4"
                    style={{ color: currentTheme.text.secondary }}
                  >
                    Primary Buttons
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                      style={{
                        background: DesignTokens.gradient.primary.css,
                        color: currentTheme.text.primary,
                      }}
                    >
                      Primary Gradient
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                      style={{
                        background: currentTheme.accent.emerald.from,
                        color: currentTheme.text.primary,
                      }}
                    >
                      Solid Emerald
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                      style={{
                        background: "transparent",
                        border: `2px solid ${currentTheme.accent.emerald.from}`,
                        color: currentTheme.accent.emerald.from,
                      }}
                    >
                      Outlined
                    </button>
                  </div>
                </div>

                <div
                  className="glass-container p-6"
                  style={{ background: currentTheme.background.glass }}
                >
                  <h4
                    className="text-sm mb-4"
                    style={{ color: currentTheme.text.secondary }}
                  >
                    Glass & Ghost Buttons
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                      style={{
                        background: currentTheme.background.glass,
                        backdropFilter: DesignTokens.backdropBlur.md,
                        border: `1px solid ${DesignTokens.borderColor.dark.base}`,
                        color: currentTheme.text.primary,
                      }}
                    >
                      Glass Button
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                      style={{
                        background: "transparent",
                        color: currentTheme.text.secondary,
                      }}
                    >
                      Ghost Button
                    </button>
                  </div>
                </div>

                <div
                  className="glass-container p-6"
                  style={{ background: currentTheme.background.glass }}
                >
                  <h4
                    className="text-sm mb-4"
                    style={{ color: currentTheme.text.secondary }}
                  >
                    Status Buttons
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                      style={{
                        background: currentTheme.status.success,
                        color: currentTheme.text.primary,
                      }}
                    >
                      Success
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                      style={{
                        background: currentTheme.status.warning,
                        color: currentTheme.background.primary,
                      }}
                    >
                      Warning
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                      style={{
                        background: currentTheme.status.critical,
                        color: currentTheme.text.primary,
                      }}
                    >
                      Critical
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                      style={{
                        background: currentTheme.status.info,
                        color: currentTheme.text.primary,
                      }}
                    >
                      Info
                    </button>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Card Variations" icon={Layers} theme={currentTheme}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  className="p-6 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: currentTheme.background.glass,
                    backdropFilter: DesignTokens.backdropBlur.md,
                    border: `1px solid ${DesignTokens.borderColor.dark.base}`,
                    boxShadow: DesignTokens.boxShadow.glass,
                  }}
                >
                  <Sparkles
                    className="w-8 h-8 mb-3"
                    style={{ color: currentTheme.accent.emerald.from }}
                  />
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: currentTheme.text.primary }}
                  >
                    Glass Card
                  </h3>
                  <p style={{ color: currentTheme.text.tertiary }}>
                    Glassmorphic design with backdrop blur
                  </p>
                </div>

                <div
                  className="p-6 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: DesignTokens.gradient.primary.css,
                  }}
                >
                  <Zap
                    className="w-8 h-8 mb-3"
                    style={{ color: currentTheme.text.primary }}
                  />
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: currentTheme.text.primary }}
                  >
                    Gradient Card
                  </h3>
                  <p style={{ color: currentTheme.text.secondary }}>
                    Vibrant gradient backgrounds
                  </p>
                </div>

                <div
                  className="p-6 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: currentTheme.background.tertiary,
                    boxShadow: DesignTokens.boxShadow.xl,
                  }}
                >
                  <Layers
                    className="w-8 h-8 mb-3"
                    style={{ color: currentTheme.accent.violet.from }}
                  />
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: currentTheme.text.primary }}
                  >
                    Elevated Card
                  </h3>
                  <p style={{ color: currentTheme.text.tertiary }}>
                    Enhanced depth with shadows
                  </p>
                </div>
              </div>
            </Section>

            <Section title="Icon Sizes" icon={Circle} theme={currentTheme}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(DesignTokens.iconSize).map(([key, value]) => (
                  <div
                    key={key}
                    className="glass-container p-6 text-center cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => copyToClipboard(value, `IconSize.${key}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        copyToClipboard(value, `IconSize.${key}`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    style={{ background: currentTheme.background.glass }}
                  >
                    <Stars
                      style={{
                        width: value,
                        height: value,
                        color: currentTheme.accent.emerald.from,
                        margin: "0 auto 0.75rem",
                      }}
                    />
                    <p
                      className="text-sm font-mono"
                      style={{ color: currentTheme.text.secondary }}
                    >
                      {key}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: currentTheme.text.tertiary }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Input Fields" icon={Type} theme={currentTheme}>
              <div className="space-y-4">
                <div
                  className="glass-container p-6"
                  style={{ background: currentTheme.background.glass }}
                >
                  <input
                    type="text"
                    placeholder="Glass input field"
                    className="w-full px-4 py-3 rounded-lg transition-all focus:scale-[1.01]"
                    style={{
                      background: currentTheme.background.glass,
                      border: `1px solid ${DesignTokens.borderColor.dark.base}`,
                      color: currentTheme.text.primary,
                      outline: "none",
                    }}
                  />
                </div>

                <div
                  className="glass-container p-6"
                  style={{ background: currentTheme.background.glass }}
                >
                  <textarea
                    placeholder="Glass textarea"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg transition-all resize-none"
                    style={{
                      background: currentTheme.background.glass,
                      border: `1px solid ${DesignTokens.borderColor.dark.base}`,
                      color: currentTheme.text.primary,
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </Section>

            <Section title="Loading States" icon={Clock} theme={currentTheme}>
              <div
                className="glass-container p-6"
                style={{ background: currentTheme.background.glass }}
              >
                <div className="space-y-6">
                  <div>
                    <p
                      className="text-sm mb-3"
                      style={{ color: currentTheme.text.secondary }}
                    >
                      Skeleton Loaders
                    </p>
                    <div className="space-y-3">
                      <div className="h-4 rounded skeleton w-3/4" />
                      <div className="h-4 rounded skeleton w-full" />
                      <div className="h-4 rounded skeleton w-5/6" />
                    </div>
                  </div>

                  <div>
                    <p
                      className="text-sm mb-3"
                      style={{ color: currentTheme.text.secondary }}
                    >
                      Pulse Animation
                    </p>
                    <div className="flex gap-3">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-16 h-16 rounded-full animate-pulse"
                          style={{
                            background: DesignTokens.gradient.primary.css,
                            animationDelay: `${i * 200}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12">
        <div
          className="glass-container p-6 text-center"
          style={{ background: currentTheme.background.glass }}
        >
          <p style={{ color: currentTheme.text.secondary }}>
            Built with{" "}
            <span style={{ color: currentTheme.status.critical }}>♥</span> using{" "}
            <span style={{ color: currentTheme.accent.emerald.from }}>
              DeskOps Design System
            </span>
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: currentTheme.text.tertiary }}
          >
            GZANSP × AOC Compliant • OKLCH Color Space • Type-Safe Tokens
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface SectionProps {
  title: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  children: React.ReactNode;
  theme: typeof DarkTheme | typeof LightTheme;
}

function Section({ title, icon: Icon, children, theme }: SectionProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Icon
          className="w-6 h-6"
          style={{ color: theme.accent.emerald.from }}
          aria-hidden="true"
        />
        <h2
          className="text-2xl font-bold"
          style={{
            background: DesignTokens.gradient.primary.css,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

interface ColorGroupProps {
  title: string;
  colors: Array<{
    label: string;
    value: string;
    key: string;
  }>;
  onCopy: (text: string, label: string) => void;
  copied: string | null;
  theme: typeof DarkTheme | typeof LightTheme;
}

function ColorGroup({ title, colors, onCopy, copied, theme }: ColorGroupProps) {
  return (
    <div
      className="glass-container p-6"
      style={{ background: theme.background.glass }}
    >
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: theme.text.primary }}
      >
        {title}
      </h3>
      <div className="space-y-3">
        {colors.map((color) => (
          <div
            key={color.key}
            className="flex items-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform p-2 rounded focus:outline-none focus:ring-2"
            onClick={() => onCopy(color.value, color.key)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCopy(color.value, color.key);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Copy ${color.label} color: ${color.value}`}
            style={{
              outline: "none",
              boxShadow:
                copied === color.key
                  ? `0 0 0 2px ${theme.status.success}`
                  : "none",
            }}
          >
            <div
              className="w-12 h-12 rounded-lg shrink-0"
              style={{ background: color.value }}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium"
                style={{ color: theme.text.secondary }}
              >
                {color.label}
              </p>
              <p
                className="text-xs font-mono truncate"
                style={{ color: theme.text.tertiary }}
              >
                {color.value}
              </p>
            </div>
            {copied === color.key ? (
              <Check
                className="w-4 h-4"
                style={{ color: theme.status.success }}
                aria-hidden="true"
              />
            ) : (
              <Copy
                className="w-4 h-4"
                style={{ color: theme.text.tertiary }}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface GradientCardProps {
  title: string;
  gradient: string;
  from: string;
  to: string;
  keyPath: string;
  onCopy: (text: string, label: string) => void;
  theme: typeof DarkTheme | typeof LightTheme;
}

function GradientCard({
  title,
  gradient,
  from,
  to,
  keyPath,
  onCopy,
  theme,
}: GradientCardProps) {
  return (
    <div
      className="glass-container overflow-hidden cursor-pointer hover:scale-105 transition-transform focus:outline-none focus:ring-2"
      onClick={() => onCopy(gradient, keyPath)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCopy(gradient, keyPath);
        }
      }}
      style={{ background: theme.background.glass, outline: "none" }}
      role="button"
      tabIndex={0}
      aria-label={`Copy ${title} gradient`}
    >
      <div
        className="h-32"
        style={{ background: gradient }}
        aria-hidden="true"
      />
      <div className="p-4">
        <h4
          className="font-semibold mb-2"
          style={{ color: theme.text.primary }}
        >
          {title}
        </h4>
        <div
          className="space-y-1 text-xs font-mono"
          style={{ color: theme.text.tertiary }}
        >
          <p>from: {from}</p>
          <p>to: {to}</p>
        </div>
      </div>
    </div>
  );
}
