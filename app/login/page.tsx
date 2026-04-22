// app/login/page.tsx (Enhanced)
import { Suspense } from "react";
import LoginForm from "@/components/login/LoginForm";
import { Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary/20">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />

      {/* Animated shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* County Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/30">
              <Shield className="h-3.5 w-3.5 text-secondary" />
              <span className="text-xs font-medium text-white">
                Nairobi City County | Innovation & Digital Economy
              </span>
            </div>
            <div className="flex justify-center mb-3">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">NC</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-white/80 text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-6 md:p-8">
              <Suspense
                fallback={<div className="text-center py-8">Loading...</div>}
              >
                <LoginForm />
              </Suspense>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-white/70 text-xs mt-8">
            Secure login powered by Nairobi City County
          </p>
        </div>
      </div>
    </div>
  );
}
