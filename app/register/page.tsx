import { Suspense } from "react";
import { RegisterForm } from "./RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary" />
            </div>
            <CardTitle className="text-2xl">Employee Registration</CardTitle>
            <CardDescription>
              Verify your employment to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={<div className="text-center py-4">Loading...</div>}
            >
              <RegisterForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
