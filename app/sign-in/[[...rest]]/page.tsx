import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl",
              headerTitle: "text-white text-2xl font-bold",
              headerSubtitle: "text-white/70",
              socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20",
              formFieldInput: "bg-white/10 border-white/20 text-white placeholder:text-white/50",
              formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
              footerActionLink: "text-blue-400 hover:text-blue-300"
            }
          }}
        />
      </div>
    </div>
  );
}
