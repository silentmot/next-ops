import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl",
              headerTitle: "text-white text-2xl font-bold",
              headerSubtitle: "text-white/70",
              socialButtonsBlockButton:
                "bg-white/10 border-white/20 text-white hover:bg-white/20",
              formFieldInput:
                "bg-white/10 border-white/20 text-white placeholder:text-white/50",
              formButtonPrimary:
                "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
              footerActionLink: "text-purple-400 hover:text-purple-300",
            },
          }}
        />
      </div>
    </div>
  );
}
