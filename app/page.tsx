import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Palette, Shield, Sparkles, Zap } from "lucide-react";
import { DesignTokens } from "@/lib/DesignTokens";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignedOut>
        <div className="w-full max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{
                background: DesignTokens.gradient.signIn.css,
              }}
            >
              <span className="text-2xl font-bold text-white">OPS</span>
            </div>

            <h1
              className="text-5xl sm:text-6xl font-bold mb-6 leading-tight"
              style={{
                background: DesignTokens.gradient.rainbow.css,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Operations Portal
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your gateway to advanced operations management. Secure, powerful,
              and beautifully designed for the modern enterprise.
            </p>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/60 mb-12"
              style={{
                background: DesignTokens.glassOpacity.light,
                border: `1px solid ${DesignTokens.borderOpacity.light}`,
                backdropFilter: DesignTokens.backdropBlur.md,
              }}
            >
              <Sparkles className="w-4 h-4" />
              Next-generation authentication experience
            </div>
          </div>

          {/* Authentication Section */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Sign In Card */}
            <div
              className="p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
              style={{
                background: DesignTokens.glassOpacity.light,
                border: `1px solid ${DesignTokens.borderOpacity.light}`,
                backdropFilter: DesignTokens.backdropBlur.lg,
              }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3">
                Welcome Back
              </h3>
              <p className="text-white/70 mb-6">
                Continue your operations journey with secure authentication
              </p>

              <SignInButton>
                <button
                  type="button"
                  className="w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: DesignTokens.gradient.signIn.css,
                    boxShadow: DesignTokens.boxShadow.brand.primary,
                  }}
                >
                  Sign In to Dashboard
                </button>
              </SignInButton>
            </div>

            {/* Sign Up Card */}
            <div
              className="p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
              style={{
                background: DesignTokens.glassOpacity.light,
                border: `1px solid ${DesignTokens.borderOpacity.light}`,
                backdropFilter: DesignTokens.backdropBlur.lg,
              }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-linear-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3">
                Get Started
              </h3>
              <p className="text-white/70 mb-6">
                Join the operations platform and unlock powerful features
              </p>

              <SignUpButton>
                <button
                  type="button"
                  className="w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: DesignTokens.gradient.signUp.css,
                    boxShadow: DesignTokens.boxShadow.brand.secondary,
                  }}
                >
                  Create Account
                </button>
              </SignUpButton>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  id: "secure",
                  icon: Shield,
                  title: "Secure",
                  desc: "Enterprise-grade security",
                  gradient: "from-emerald-500 to-teal-600",
                },
                {
                  id: "fast",
                  icon: Zap,
                  title: "Fast",
                  desc: "Lightning-fast operations",
                  gradient: "from-yellow-500 to-orange-600",
                },
                {
                  id: "beautiful",
                  icon: Palette,
                  title: "Beautiful",
                  desc: "Modern, intuitive design",
                  gradient: "from-pink-500 to-rose-600",
                },
              ].map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="p-6 rounded-lg text-center group hover:scale-105 transition-all duration-300"
                    style={{
                      background: DesignTokens.glassOpacity.subtle,
                      border: `1px solid ${DesignTokens.borderOpacity.medium}`,
                    }}
                  >
                    <div
                      className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-linear-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-white/60 text-sm">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{
              background: DesignTokens.gradient.signIn.css,
            }}
          >
            <span className="text-2xl font-bold text-white">OPS</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Operations Portal
          </h1>

          <p className="text-white/70 mb-8">
            You're successfully authenticated. Redirecting to dashboard...
          </p>

          <div
            className="inline-block px-6 py-3 rounded-lg text-white font-medium"
            style={{
              background: DesignTokens.gradient.signIn.css,
            }}
          >
            Loading Dashboard...
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
