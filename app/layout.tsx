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
import { ThemeProvider } from "../lib/theme";
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
    colorPrimary: "oklch(0.62 0.25 264)",
    colorDanger: "oklch(0.63 0.26 27)",
    colorSuccess: "oklch(0.68 0.19 160)",
    colorWarning: "oklch(0.75 0.19 75)",
    colorNeutral: "oklch(0.54 0.04 250)",
    colorBackground: "oklch(0.13 0.02 265)",
    colorInputBackground: "oklch(1 0 0 / 0.05)",
    colorInputText: "oklch(0.98 0.01 250)",
    colorText: "oklch(0.98 0.01 250)",
    colorTextSecondary: "oklch(0.68 0.04 250)",
    colorTextOnPrimaryBackground: "oklch(1 0 0)",

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
    spacingUnit: "1rem",
    borderRadius: "12px",

    // Advanced visual effects
    shadowShimmer: "0 0 50px oklch(0.62 0.25 264 / 0.3)",
    shadowFocus: "0 0 0 3px oklch(0.62 0.25 264 / 0.2)",
  },
  elements: {
    // Main container with glassmorphic effect
    card: {
      backgroundColor: "oklch(0.13 0.02 265 / 0.8)",
      backdropFilter: "blur(20px)",
      border: "1px solid oklch(1 0 0 / 0.1)",
      borderRadius: "20px",
      boxShadow:
        "0 25px 50px -12px oklch(0 0 0 / 0.5), 0 0 100px oklch(0.62 0.25 264 / 0.1)",
      padding: "2.5rem",
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background:
          "linear-gradient(90deg, transparent, oklch(0.62 0.25 264 / 0.8), transparent)",
      },
    },

    // Header styling with gradient text
    headerTitle: {
      background:
        "linear-gradient(135deg, oklch(0.62 0.25 264) 0%, oklch(0.64 0.24 293) 50%, oklch(0.65 0.29 350) 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "2rem",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "0.5rem",
      letterSpacing: "-0.025em",
    },

    headerSubtitle: {
      color: "oklch(0.68 0.04 250)",
      fontSize: "1rem",
      textAlign: "center",
      marginBottom: "2rem",
      opacity: 0.8,
    },

    // Form elements with advanced styling
    formFieldInput: {
      backgroundColor: "oklch(1 0 0 / 0.05)",
      border: "1px solid oklch(1 0 0 / 0.1)",
      borderRadius: "12px",
      color: "oklch(0.98 0.01 250)",
      fontSize: "16px",
      padding: "0.875rem 1rem",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:focus": {
        backgroundColor: "oklch(1 0 0 / 0.08)",
        borderColor: "oklch(0.62 0.25 264)",
        boxShadow:
          "0 0 0 3px oklch(0.62 0.25 264 / 0.2), 0 0 20px oklch(0.62 0.25 264 / 0.1)",
        outline: "none",
      },
      "&::placeholder": {
        color: "oklch(0.52 0.03 250)",
      },
    },

    // Primary button with gradient and animation
    formButtonPrimary: {
      background:
        "linear-gradient(135deg, oklch(0.62 0.25 264) 0%, oklch(0.64 0.24 293) 100%)",
      border: "none",
      borderRadius: "12px",
      color: "oklch(1 0 0)",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      padding: "0.875rem 2rem",
      position: "relative",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-100%",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.2), transparent)",
        transition: "left 0.6s ease",
      },
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 10px 25px oklch(0.62 0.25 264 / 0.4)",
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
      backgroundColor: "oklch(1 0 0 / 0.05)",
      border: "1px solid oklch(1 0 0 / 0.1)",
      borderRadius: "12px",
      color: "oklch(0.98 0.01 250)",
      padding: "0.875rem 1rem",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        backgroundColor: "oklch(1 0 0 / 0.1)",
        borderColor: "oklch(1 0 0 / 0.2)",
        transform: "translateY(-1px)",
      },
    },

    // Links and navigation
    footerActionLink: {
      color: "oklch(0.62 0.25 264)",
      textDecoration: "none",
      fontWeight: "500",
      transition: "all 0.3s ease",
      "&:hover": {
        color: "oklch(0.64 0.24 293)",
        textDecoration: "underline",
        textDecorationColor: "oklch(0.64 0.24 293)",
        textUnderlineOffset: "4px",
      },
    },

    // User button with custom styling
    userButtonAvatarBox: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      border: "2px solid transparent",
      background:
        "linear-gradient(135deg, oklch(0.62 0.25 264), oklch(0.64 0.24 293)) border-box",
      WebkitMask:
        "linear-gradient(oklch(1 0 0) 0 0) padding-box, linear-gradient(oklch(1 0 0) 0 0)",
      WebkitMaskComposite: "subtract",
      maskComposite: "subtract",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0 0 20px oklch(0.62 0.25 264 / 0.4)",
      },
    },

    // Form field labels
    formFieldLabel: {
      color: "oklch(0.91 0.01 250)",
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "0.5rem",
    },

    // Error styling
    formFieldErrorText: {
      color: "oklch(0.63 0.26 27)",
      fontSize: "14px",
      marginTop: "0.5rem",
      fontWeight: "500",
    },

    // Loading states
    spinner: {
      color: "oklch(0.62 0.25 264)",
    },

    // Modal/popover styling
    modalContent: {
      backgroundColor: "oklch(0.13 0.02 265 / 0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid oklch(1 0 0 / 0.1)",
      borderRadius: "20px",
      boxShadow: "0 25px 50px -12px oklch(0 0 0 / 0.7)",
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
        >
          {/* Animated background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute -top-1/2 -left-1/2 w-full h-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.62 0.25 264 / 0.1) 0%, transparent 70%)",
                animation: "float 20s ease-in-out infinite",
              }}
            />
            <div
              className="absolute -bottom-1/2 -right-1/2 w-full h-full opacity-20"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.64 0.24 293 / 0.1) 0%, transparent 70%)",
                animation: "float 25s ease-in-out infinite reverse",
              }}
            />
          </div>

          {/* Sophisticated header with glassmorphic effect */}
          <header
            className="relative z-10 backdrop-blur-md border-b"
            style={{
              backgroundColor: "oklch(0.13 0.02 265 / 0.8)",
              borderBottomColor: "oklch(1 0 0 / 0.1)",
            }}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.62 0.25 264) 0%, oklch(0.64 0.24 293) 100%)",
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
                          background:
                            "linear-gradient(135deg, oklch(0.62 0.25 264) 0%, oklch(0.64 0.24 293) 100%)",
                          boxShadow: "0 4px 15px oklch(0.62 0.25 264 / 0.3)",
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
              {children}
            </ThemeProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
