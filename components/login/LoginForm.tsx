// components/login/LoginForm.tsx (Enhanced)
"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Fingerprint,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authenticate } from "@/lib/actions/loginActions";
import Link from "next/link";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-2">
        <Label htmlFor="identifier" className="text-foreground font-medium">
          Email or Personal Number
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="identifier"
            name="identifier"
            type="text"
            placeholder="e.g., jane@example.com or 12345678"
            className="pl-9 h-11 bg-background/50 focus:bg-background transition-colors"
            required
            autoComplete="username"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Use your registered email or National ID/Personal Number
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-foreground font-medium">
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-9 pr-9 h-11 bg-background/50 focus:bg-background transition-colors"
            required
            minLength={6}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <Alert
          variant="destructive"
          className="animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full h-11 gap-2 bg-primary hover:bg-primary/90 transition-all"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Optional biometric/login hint */}
      <div className="text-center">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          onClick={() => alert("Biometric login coming soon")}
        >
          <Fingerprint className="h-4 w-4" /> Use biometric login
        </button>
      </div>

      <p className="text-center text-sm text-muted-foreground pt-2">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          Get started
        </Link>
      </p>

      <div className="bg-primary/5 rounded-lg p-3 text-xs text-center text-muted-foreground">
        <p>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </form>
  );
}
