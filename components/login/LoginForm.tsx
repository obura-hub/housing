// components/login/LoginForm.tsx (Simplified)
"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authenticate } from "@/lib/actions/loginActions";
import Link from "next/link";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div className="space-y-2">
        <Label htmlFor="identifier">Email or Personal Number</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="identifier"
            name="identifier"
            type="text"
            placeholder="e.g., jane@example.com or 12345678"
            className="pl-9"
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
          <Label htmlFor="password">Password</Label>
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
            className="pl-9 pr-9"
            required
            minLength={6}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign In"}
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          Get started
        </Link>
      </p>

      <div className="bg-muted/30 rounded-lg p-3 text-xs text-center text-muted-foreground">
        <p>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </form>
  );
}
