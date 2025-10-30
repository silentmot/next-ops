/** biome-ignore-all assist/source/organizeImports: Clerk components must maintain specific import order */
import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib";
import { AppLoadingWrapper } from "@components/AppLoadingWrapper";
import { DesignTokens } from "@/lib/DesignTokens";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OPS - Advanced Authentication",
  description: "Next-generation authentication experience with Clerk",
};

// Advanced Clerk appearance configuration with creative theming
const clerkAppearance = {
  cssLayerName: "clerk-advanced",
  variables: {
    // Color palette with sophisticated gradients
    colorPrimary: DesignTokens.theme.dark.accent.emerald.from,
    colorDanger: DesignTokens.theme.dark.status.critical,
    colorSuccess: DesignTokens.theme.dark.status.success,
    colorWarning: DesignTokens.theme.dark.status.warning,
    colorNeutral: DesignTokens.theme.dark.text.tertiary,
    colorBackground: DesignTokens.theme.dark.background.primary,
    colorInputBackground: DesignTokens.glassOpacity.light,
    colorInputText: DesignTokens.theme.dark.text.primary,
    colorText: DesignTokens.theme.dark.text.primary,
    colorTextSecondary: DesignTokens.theme.dark.text.secondary,
    colorTextOnPrimaryBackground: DesignTokens.theme.dark.text.interactive,

    // Typography
    fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, sans-serif',
    fontFamilyButtons: '"Geist", -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: "16px",
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    // Spacing and layout
    spacingUnit: DesignTokens.spacing["4"],
    borderRadius: DesignTokens.borderRadius.lg,

    // Advanced visual effects
    shadowShimmer: DesignTokens.boxShadow.glow.strong,
    shadowFocus: DesignTokens.boxShadow.glow.subtle,
  },
  elements: {
    // Main container with glassmorphic effect
    card: {
      backgroundColor: DesignTokens.glassOpacity.medium,
      backdropFilter: DesignTokens.backdropBlur.lg,
      border: `1px solid ${DesignTokens.borderOpacity.light}`,
      borderRadius: DesignTokens.borderRadius["2xl"],
      boxShadow: `${DesignTokens.boxShadow["2xl"]}, ${DesignTokens.boxShadow.glow.subtle}`,
      padding: DesignTokens.spacing["10"],
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: DesignTokens.gradient.primary.css,
      },
    },

    // Header styling with gradient text
    headerTitle: {
      background: DesignTokens.gradient.rainbow.css,
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: DesignTokens.typography.fontSize["2xl"],
      fontWeight: DesignTokens.typography.fontWeight.bold,
      textAlign: "center",
      marginBottom: DesignTokens.spacing["2"],
      letterSpacing: DesignTokens.typography.letterSpacing.tight,
    },

    headerSubtitle: {
      color: DesignTokens.theme.dark.text.secondary,
      fontSize: DesignTokens.typography.fontSize.base,
      textAlign: "center",
      marginBottom: DesignTokens.spacing["8"],
      opacity: DesignTokens.opacity["80"],
    },

    // Form elements with advanced styling
    formFieldInput: {
      backgroundColor: DesignTokens.glassOpacity.light,
      border: `1px solid ${DesignTokens.borderOpacity.light}`,
      borderRadius: DesignTokens.borderRadius.lg,
      color: DesignTokens.theme.dark.text.primary,
      fontSize: DesignTokens.typography.fontSize.base,
      padding: `${DesignTokens.spacing["3.5"]} ${DesignTokens.spacing["4"]}`,
      transition: `all ${DesignTokens.duration.normal} ${DesignTokens.easing.smooth}`,
      "&:focus": {
        backgroundColor: DesignTokens.glassOpacity.medium,
        borderColor: DesignTokens.theme.dark.accent.emerald.from,
        boxShadow: `${DesignTokens.boxShadow.glow.subtle}, ${DesignTokens.boxShadow.glow.medium}`,
        outline: "none",
      },
      "&::placeholder": {
        color: DesignTokens.theme.dark.text.tertiary,
      },
    },

    // Primary button with gradient and animation
    formButtonPrimary: {
      background: DesignTokens.gradient.signIn.css,
      border: "none",
      borderRadius: DesignTokens.borderRadius.lg,
      color: DesignTokens.theme.dark.text.interactive,
      cursor: "pointer",
      fontSize: DesignTokens.typography.fontSize.base,
      fontWeight: DesignTokens.typography.fontWeight.semibold,
      padding: `${DesignTokens.spacing["3.5"]} ${DesignTokens.spacing["8"]}`,
      position: "relative",
      transition: `all ${DesignTokens.duration.normal} ${DesignTokens.easing.smooth}`,
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-100%",
        width: "100%",
        height: "100%",
        background: `linear-gradient(90deg, transparent, ${DesignTokens.glassOpacity.medium}, transparent)`,
        transition: `left ${DesignTokens.duration.slow} ease`,
      },
      "&:hover": {
        transform: `scale(${DesignTokens.scale.small})`,
        boxShadow: DesignTokens.boxShadow.brand.primary,
        "&::before": {
          left: "100%",
        },
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },

    // Secondary/social buttons
    socialButtonsBlockButton: {
      backgroundColor: DesignTokens.glassOpacity.light,
      border: `1px solid ${DesignTokens.borderOpacity.light}`,
      borderRadius: DesignTokens.borderRadius.lg,
      color: DesignTokens.theme.dark.text.primary,
      padding: `${DesignTokens.spacing["3.5"]} ${DesignTokens.spacing["4"]}`,
      transition: `all ${DesignTokens.duration.normal} ${DesignTokens.easing.smooth}`,
      "&:hover": {
        backgroundColor: DesignTokens.glassOpacity.medium,
        borderColor: DesignTokens.borderOpacity.medium,
        transform: `scale(${DesignTokens.scale.subtle})`,
      },
    },

    // Links and navigation
    footerActionLink: {
      color: DesignTokens.theme.dark.accent.emerald.from,
      textDecoration: "none",
      fontWeight: DesignTokens.typography.fontWeight.medium,
      transition: `all ${DesignTokens.duration.normal} ease`,
      "&:hover": {
        color: DesignTokens.theme.dark.accent.violet.from,
        textDecoration: "underline",
        textDecorationColor: DesignTokens.theme.dark.accent.violet.from,
        textUnderlineOffset: "4px",
      },
    },

    // User button with custom styling
    userButtonAvatarBox: {
      width: DesignTokens.spacing["10"],
      height: DesignTokens.spacing["10"],
      borderRadius: DesignTokens.borderRadius.full,
      border: `${DesignTokens.borderWidth["2"]} solid transparent`,
      background: `${DesignTokens.gradient.signIn.css} border-box`,
      WebkitMask:
        "linear-gradient(oklch(1 0 0) 0 0) padding-box, linear-gradient(oklch(1 0 0) 0 0)",
      WebkitMaskComposite: "subtract",
      maskComposite: "subtract",
      transition: `all ${DesignTokens.duration.normal} ease`,
      "&:hover": {
        transform: `scale(${DesignTokens.scale.small})`,
        boxShadow: DesignTokens.boxShadow.glow.medium,
      },
    },

    // Form field labels
    formFieldLabel: {
      color: DesignTokens.theme.dark.text.primary,
      fontSize: DesignTokens.typography.fontSize.sm,
      fontWeight: DesignTokens.typography.fontWeight.medium,
      marginBottom: DesignTokens.spacing["2"],
    },

    // Error styling
    formFieldErrorText: {
      color: DesignTokens.theme.dark.status.critical,
      fontSize: DesignTokens.typography.fontSize.sm,
      marginTop: DesignTokens.spacing["2"],
      fontWeight: DesignTokens.typography.fontWeight.medium,
    },

    // Loading states
    spinner: {
      color: DesignTokens.theme.dark.accent.emerald.from,
    },

    // Modal/popover styling
    modalContent: {
      backgroundColor: DesignTokens.glassOpacity.strong,
      backdropFilter: DesignTokens.backdropBlur.lg,
      border: `1px solid ${DesignTokens.borderOpacity.light}`,
      borderRadius: DesignTokens.borderRadius["2xl"],
      boxShadow: DesignTokens.boxShadow["2xl"],
    },
  },
  layout: {
    logoImageUrl: undefined,
    showOptionalFields: true,
    socialButtonsVariant: "blockButton" as const,
    socialButtonsPlacement: "bottom" as const,
    privacyPageUrl: "/privacy",
    termsPageUrl: "/terms",
    helpPageUrl: "/help",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
          style={{
            background:
              "linear-gradient(135deg, oklch(0.13 0.02 265) 0%, oklch(0.21 0.08 275) 50%, oklch(0.30 0.10 280) 100%)",
            backgroundAttachment: "fixed",
          }}
          suppressHydrationWarning={true}
        >
          {/* Animated background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute -top-1/2 -left-1/2 w-full h-full opacity-30"
              style={{
                background: `radial-gradient(circle, ${DesignTokens.theme.dark.accent.emerald.from} / ${DesignTokens.opacity["10"]} 0%, transparent 70%)`,
                animation: "float 20s ease-in-out infinite",
              }}
            />
            <div
              className="absolute -bottom-1/2 -right-1/2 w-full h-full opacity-20"
              style={{
                background: `radial-gradient(circle, ${DesignTokens.theme.dark.accent.violet.from} / ${DesignTokens.opacity["10"]} 0%, transparent 70%)`,
                animation: "float 25s ease-in-out infinite reverse",
              }}
            />
          </div>

          {/* Sophisticated header with glassmorphic effect */}
          <header
            className="relative z-10 backdrop-blur-md border-b"
            style={{
              backgroundColor: DesignTokens.glassOpacity.medium,
              borderBottomColor: DesignTokens.borderOpacity.light,
            }}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                    style={{
                      background: DesignTokens.gradient.signIn.css,
                    }}
                  >
                    OPS
                  </div>
                  <h1 className="text-xl font-semibold text-white hidden sm:block">
                    Operations Portal
                  </h1>
                </div>

                <div className="flex items-center space-x-4">
                  <SignedOut>
                    <SignInButton>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                      >
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton>
                      <button
                        type="button"
                        className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 hover:transform hover:scale-105"
                        style={{
                          background: DesignTokens.gradient.signIn.css,
                          boxShadow: DesignTokens.boxShadow.brand.primary,
                        }}
                      >
                        Get Started
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox:
                            clerkAppearance.elements.userButtonAvatarBox,
                        },
                      }}
                    />
                  </SignedIn>
                </div>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="relative z-10">
            <ThemeProvider defaultVariant="cosmic" defaultDarkMode={true}>
              <AppLoadingWrapper>{children}</AppLoadingWrapper>
            </ThemeProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
