/**
 * OPS Design System - Theme Demo Page
 * Showcasing the museum-quality theme system
 * Created: October 29, 2025
 */

"use client";

import {
  Code,
  Heart,
  Layers,
  Palette,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import {
  Button,
  Card,
  Container,
  GradientText,
  ThemeSwitcher,
  useTheme,
} from "../../lib/theme";

export default function ThemeDemo() {
  const { tokens, variant } = useTheme();

  return (
    <div className="min-h-screen p-8 space-y-12">
      <Container size="xl" center>
        {/* Header */}
        <div className="text-center mb-12">
          <GradientText as="h1" gradient="rainbow" className="text-6xl mb-4">
            OPS Design System
          </GradientText>
          <GradientText
            as="p"
            gradient="primary"
            className="text-xl font-normal"
          >
            Museum-Quality Theme Architecture
          </GradientText>
          <p className="text-white/70 mt-4 text-lg max-w-2xl mx-auto">
            A comprehensive design system with dynamic theming, glassmorphic
            components, and professional-grade styling architecture.
          </p>

          <div className="mt-8 flex justify-center">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Theme Showcase */}
        <section className="mb-16">
          <GradientText as="h2" className="text-3xl mb-8 text-center">
            Current Theme: {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </GradientText>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Color Tokens */}
            <Card variant="glass" hover>
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-xl mx-auto mb-4"
                  style={{ background: tokens.colors.gradients.primary }}
                />
                <h3 className="text-white font-semibold mb-2">
                  Primary Gradient
                </h3>
                <p className="text-white/60 text-sm">Brand identity color</p>
              </div>
            </Card>

            <Card variant="glass" hover>
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-xl mx-auto mb-4"
                  style={{ background: tokens.colors.gradients.rainbow }}
                />
                <h3 className="text-white font-semibold mb-2">
                  Rainbow Gradient
                </h3>
                <p className="text-white/60 text-sm">Multi-color harmony</p>
              </div>
            </Card>

            <Card variant="glass" hover>
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-xl mx-auto mb-4 border border-white/20"
                  style={{ background: tokens.colors.glass.medium }}
                />
                <h3 className="text-white font-semibold mb-2">Glass Surface</h3>
                <p className="text-white/60 text-sm">Glassmorphic effect</p>
              </div>
            </Card>

            <Card variant="glass" hover>
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-xl mx-auto mb-4"
                  style={{ background: tokens.colors.brand.surface }}
                />
                <h3 className="text-white font-semibold mb-2">Brand Surface</h3>
                <p className="text-white/60 text-sm">Component background</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Component Showcase */}
        <section className="mb-16">
          <GradientText as="h2" className="text-3xl mb-8 text-center">
            Component Library
          </GradientText>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Buttons */}
            <Card variant="glass">
              <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Button Variants
              </h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" size="sm">
                    Primary Small
                  </Button>
                  <Button variant="primary" size="md">
                    Primary Medium
                  </Button>
                  <Button variant="primary" size="lg">
                    Primary Large
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="glass">Glass</Button>
                </div>
              </div>
            </Card>

            {/* Cards */}
            <Card variant="glass">
              <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Card Variants
              </h3>
              <div className="space-y-4">
                <Card variant="glass" className="p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-blue-400" />
                    <div>
                      <h4 className="text-white font-medium">Glass Card</h4>
                      <p className="text-white/60 text-sm">
                        Glassmorphic design
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="elevated" className="p-4">
                  <div className="flex items-center gap-3">
                    <Star className="w-8 h-8 text-yellow-400" />
                    <div>
                      <h4 className="text-white font-medium">Elevated Card</h4>
                      <p className="text-white/60 text-sm">
                        Enhanced shadow depth
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="bordered" className="p-4">
                  <div className="flex items-center gap-3">
                    <Heart className="w-8 h-8 text-pink-400" />
                    <div>
                      <h4 className="text-white font-medium">Bordered Card</h4>
                      <p className="text-white/60 text-sm">
                        Clean border style
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          </div>
        </section>

        {/* Typography Showcase */}
        <section className="mb-16">
          <GradientText as="h2" className="text-3xl mb-8 text-center">
            Typography System
          </GradientText>

          <Card variant="glass" className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <GradientText as="h1" className="text-5xl">
                  Heading 1 - Primary Gradient
                </GradientText>
                <p className="text-white/60 mt-2">5xl / 48px - Hero headings</p>
              </div>

              <div>
                <GradientText as="h2" gradient="rainbow" className="text-4xl">
                  Heading 2 - Rainbow Gradient
                </GradientText>
                <p className="text-white/60 mt-2">
                  4xl / 36px - Section headings
                </p>
              </div>

              <div>
                <GradientText as="h3" className="text-2xl">
                  Heading 3 - Primary Gradient
                </GradientText>
                <p className="text-white/60 mt-2">
                  2xl / 24px - Subsection headings
                </p>
              </div>

              <div>
                <p className="text-white text-lg">
                  Body Large - Regular text for important content and
                  descriptions.
                </p>
                <p className="text-white/60 mt-1">
                  lg / 18px - Enhanced readability
                </p>
              </div>

              <div>
                <p className="text-white">
                  Body Regular - Standard text for most content and UI elements.
                </p>
                <p className="text-white/60 mt-1">
                  base / 16px - Default body text
                </p>
              </div>

              <div>
                <p className="text-white text-sm">
                  Body Small - Secondary information and metadata.
                </p>
                <p className="text-white/60 mt-1">
                  sm / 14px - Supporting text
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Feature Grid */}
        <section className="mb-16">
          <GradientText as="h2" className="text-3xl mb-8 text-center">
            Design System Features
          </GradientText>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Palette,
                title: "Dynamic Theming",
                description:
                  "Four carefully crafted theme variants with real-time switching",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Layers,
                title: "Glassmorphic Design",
                description:
                  "Modern glass effects with proper backdrop filtering",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Code,
                title: "TypeScript First",
                description:
                  "Fully typed components with excellent developer experience",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: Zap,
                title: "Performance Optimized",
                description:
                  "Memoized theme calculations and efficient re-renders",
                gradient: "from-yellow-500 to-orange-500",
              },
              {
                icon: Shield,
                title: "Design Tokens",
                description:
                  "Centralized design system with consistent spacing and colors",
                gradient: "from-red-500 to-pink-500",
              },
              {
                icon: Sparkles,
                title: "Premium Quality",
                description:
                  "Museum-grade attention to detail and professional polish",
                gradient: "from-indigo-500 to-purple-500",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                variant="glass"
                hover
                className="text-center"
              >
                <div
                  className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-linear-to-br ${feature.gradient}`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card variant="glass" className="max-w-2xl mx-auto">
            <GradientText as="h2" className="text-3xl mb-4">
              Ready to Build Something Amazing?
            </GradientText>
            <p className="text-white/70 mb-8 text-lg">
              This design system is ready for production use with comprehensive
              theming, professional components, and enterprise-grade quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                className="flex items-center gap-2"
              >
                <Code className="w-5 h-5" />
                View Source Code
              </Button>
              <Button
                variant="glass"
                size="lg"
                className="flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Explore Components
              </Button>
            </div>
          </Card>
        </section>
      </Container>
    </div>
  );
}
