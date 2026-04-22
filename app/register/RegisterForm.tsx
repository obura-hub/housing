"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  lookupUserAndSendOtp,
  resendOtp,
  verifyOtpForAuth,
} from "@/lib/actions/authorizationActions";

type IdType = "national-id" | "personal-no";
type Step = "enter-id" | "verify-otp";

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("enter-id");
  const [idType, setIdType] = useState<IdType>("national-id");
  const [idNumber, setIdNumber] = useState("");
  const [dob, setDob] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2);
    if (value.length >= 5) value = value.slice(0, 5) + "/" + value.slice(5, 9);
    if (value.length <= 10) setDob(value);
  };

  const validateDob = (dobString: string): boolean =>
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dobString);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!idNumber.trim())
      return setError("Please enter your ID or personal number.");
    if (!dob.trim()) return setError("Please enter your date of birth.");
    if (!validateDob(dob))
      return setError("Invalid date format. Use DD/MM/YYYY.");

    setIsLoading(true);
    try {
      const result = await lookupUserAndSendOtp(idType, idNumber, dob);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSessionToken(result.sessionToken);
      setMaskedPhone(result.maskedPhone);
      setStep("verify-otp");
      setInfo(`OTP sent to ${result.maskedPhone}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otp.trim()) return setError("Please enter the OTP");

    setIsLoading(true);
    try {
      const result = await verifyOtpForAuth(sessionToken, otp);
      if (!result.success) {
        setError(result.error);
        return;
      }
      // OTP verified. Check if user needs to complete registration (no password)
      // We'll assume user has no password – redirect to complete registration page
      router.push(
        `/register/complete?userId=${result.userId}&email=${encodeURIComponent(result.email || "")}`,
      );
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setInfo(null);
    setOtp("");
    const result = await resendOtp(sessionToken);
    if (!result.success) {
      setError(result.error);
    } else {
      setInfo(`A new OTP has been sent to ${maskedPhone}.`);
    }
  };

  const resetToStep1 = () => {
    setStep("enter-id");
    setIdNumber("");
    setDob("");
    setOtp("");
    setSessionToken("");
    setMaskedPhone("");
    setError(null);
    setInfo(null);
  };

  return (
    <div className="space-y-4">
      {step === "enter-id" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <Label>Identification Type</Label>
            <RadioGroup
              value={idType}
              onValueChange={(v) => setIdType(v as IdType)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="national-id" id="national-id" />
                <Label htmlFor="national-id">National ID</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal-no" id="personal-no" />
                <Label htmlFor="personal-no">Personal Number</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="idNumber">
              {idType === "national-id"
                ? "National ID Number"
                : "Personal Number"}
            </Label>
            <Input
              id="idNumber"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder={
                idType === "national-id" ? "e.g., 12345678" : "e.g., P12345"
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="dob">Date of Birth (DD/MM/YYYY)</Label>
            <Input
              id="dob"
              value={dob}
              onChange={handleDobChange}
              placeholder="15/03/1990"
              maxLength={10}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Must match your employment records.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {info && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{info}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Sign In
            </a>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-3 space-y-1 text-sm">
            <p>
              <strong>ID:</strong> {idNumber}
            </p>
            <p>
              <strong>DOB:</strong> {dob}
            </p>
            <p>
              <strong>OTP sent to:</strong> {maskedPhone}
            </p>
          </div>

          <div>
            <Label htmlFor="otp">One-Time Password (OTP)</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="123456"
              maxLength={6}
              className="tracking-[0.3em] text-center text-lg font-mono"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {info && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{info}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </Button>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetToStep1}
              className="flex-1"
            >
              Change Details
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleResendOtp}
              className="flex-1"
            >
              Resend OTP
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
