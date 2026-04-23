// app/register/complete/CompleteRegistrationForm.tsx (Simplified)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import { completeRegistration } from "@/lib/actions/registerActions";
import { Progress } from "@/components/ui/progress";

interface CompleteRegistrationFormProps {
  userId: string;
  email: string;
}

export function CompleteRegistrationForm({
  userId,
  email,
}: CompleteRegistrationFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPasswordStrength = (
    pwd: string,
  ): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];
    const index = Math.min(Math.floor(score / 1.5), 4);
    return { score, label: labels[index], color: colors[index] };
  };

  const strength = getPasswordStrength(password);
  const strengthPercent = (strength.score / 5) * 100;
  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isPasswordValid) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      await completeRegistration(userId, email, password);
      router.push(`/login?registered=true&redirectTo=/projects`);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          value={email}
          disabled
          className="bg-muted/30 text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">
          This email is from your employment record and cannot be changed.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="pr-9"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {password.length > 0 && (
          <div className="space-y-1 mt-2">
            <div className="flex justify-between text-xs">
              <span>Password strength</span>
              <span className={strength.color.replace("bg-", "text-")}>
                {strength.label}
              </span>
            </div>
            <Progress value={strengthPercent} className="h-1" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="pr-9"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="text-xs text-destructive mt-1">
            Passwords do not match
          </p>
        )}
        {confirmPassword.length > 0 &&
          passwordsMatch &&
          password.length > 0 && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Passwords match
            </p>
          )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={isLoading || !isPasswordValid || !passwordsMatch}
        className="w-full"
      >
        {isLoading ? "Creating Account..." : "Complete Registration"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By completing registration, you agree to our{" "}
        <a href="/terms" className="text-primary hover:underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
