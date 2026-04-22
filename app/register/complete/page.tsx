import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompleteRegistrationForm } from "./CompleteRegistrationForm";

interface CompletePageProps {
  searchParams: Promise<{ userId: string; email: string }>;
}

export default async function CompleteRegistrationPage({
  searchParams,
}: CompletePageProps) {
  const { userId, email } = await searchParams;
  if (!userId || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Invalid Request</CardTitle>
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Complete Registration</CardTitle>
            <CardDescription>Set a password for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={<div className="text-center py-4">Loading...</div>}
            >
              <CompleteRegistrationForm userId={userId} email={email} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
