// app/register/complete/page.tsx (Simplified)
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompleteRegistrationForm } from "./CompleteRegistrationForm";
import { Shield } from "lucide-react";
import Logo from "@/components/custom/logo";

interface CompletePageProps {
  searchParams: Promise<{ userId: string; email: string }>;
}

export default async function CompleteRegistrationPage({
  searchParams,
}: CompletePageProps) {
  const { userId, email } = await searchParams;
  if (!userId || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Invalid Request</CardTitle>
            <CardDescription>
              Missing user information. Please restart registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/register" className="text-primary underline">
              Go back
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* County Branding - Minimal */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-3 py-1 mb-3">
            <Shield className="h-3 w-3 text-primary" />
            <span className="text-xs text-muted-foreground">
              Nairobi City County
            </span>
          </div>
          <div className="flex justify-center mb-2">
            <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
              <Logo />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Complete Registration</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Set up your account password
          </p>
        </div>

        {/* Registration Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 text-center border-b border-border/50 pb-4">
            <CardTitle className="text-xl">Create Password</CardTitle>
            <CardDescription>
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Suspense
              fallback={<div className="text-center py-4">Loading...</div>}
            >
              <CompleteRegistrationForm userId={userId} email={email} />
            </Suspense>
          </CardContent>
        </Card>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Secure registration • Powered by Nairobi City County
        </p>
      </div>
    </div>
  );
}
