// components/custom/EmployeeVerificationModal.tsx (Improved spacing)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, Info, Lock, ShieldCheck } from "lucide-react";
import {
  lookupUserAndSendOtp,
  resendOtp,
  verifyOtpForAuth,
} from "@/lib/actions/authorizationActions";
import { getUserById, getUserByIdentifier } from "@/lib/actions/userActions";

type Step = "enter-id" | "verify-otp";
type IdType = "national-id" | "personal-no";

interface EmployeeVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployeeVerificationModal({
  open,
  onOpenChange,
}: EmployeeVerificationModalProps) {
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

  const resetModal = () => {
    setStep("enter-id");
    setIdType("national-id");
    setIdNumber("");
    setDob("");
    setOtp("");
    setSessionToken("");
    setMaskedPhone("");
    setError(null);
    setInfo(null);
    setIsLoading(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetModal();
      onOpenChange(false);
    }
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2);
    if (value.length >= 5) value = value.slice(0, 5) + "/" + value.slice(5, 9);
    if (value.length <= 10) setDob(value);
  };

  const validateDob = (dobString: string): boolean =>
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dobString);

  const parseDob = (dobString: string): Date | null => {
    const [d, m, y] = dobString.split("/").map(Number);
    if (!d || !m || !y) return null;
    const date = new Date(y, m - 1, d);
    return date.getDate() === d &&
      date.getMonth() === m - 1 &&
      date.getFullYear() === y
      ? date
      : null;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!idNumber.trim()) {
      setError("Please enter your ID or personal number.");
      return;
    }
    if (!dob.trim()) {
      setError("Please enter your date of birth.");
      return;
    }
    if (!validateDob(dob)) {
      setError("Please enter a valid date of birth in DD/MM/YYYY format.");
      return;
    }

    const dobDate = parseDob(dob);
    if (!dobDate || dobDate > new Date()) {
      setError("Please enter a valid date of birth.");
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
    if (age < 18) {
      setError("You must be at least 18 years old.");
      return;
    }

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
      setInfo(`A one-time password has been sent to ${result.maskedPhone}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOtpForAuth(sessionToken, otp);
      if (!result.success) {
        setError(result.error);
        return;
      }

      const user = await getUserByIdentifier(idNumber);
      const hasPassword = user?.password;

      if (!hasPassword) {
        router.push(`/register/complete?userId=${user?.userId}`);
      } else {
        onOpenChange(false);
        router.push("/login");
      }
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-t-4 border-t-primary">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Employee Verification</DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed">
            {step === "enter-id"
              ? "Enter your National ID or Personal Number and Date of Birth to verify your employment with Nairobi City County."
              : "Enter the one-time password sent to your registered phone number."}
          </DialogDescription>
        </DialogHeader>

        {step === "enter-id" ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Identification Type</Label>
              <RadioGroup
                value={idType}
                onValueChange={(val) => setIdType(val as IdType)}
                className="flex gap-6 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="national-id" id="national-id" />
                  <Label htmlFor="national-id" className="text-sm">
                    National ID
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="personal-no" id="personal-no" />
                  <Label htmlFor="personal-no" className="text-sm">
                    Personal Number
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber" className="text-sm font-medium">
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
                className="focus:ring-primary h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="text-sm font-medium">
                Date of Birth (DD/MM/YYYY)
              </Label>
              <Input
                id="dob"
                value={dob}
                onChange={handleDobChange}
                placeholder="15/03/1990"
                maxLength={10}
                required
                className="h-11"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Format: DD/MM/YYYY – must match your employment records.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {info && (
              <div className="flex items-start gap-2 text-sm text-primary bg-primary/10 rounded-md p-3">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{info}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 h-11 text-base"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>

            <div className="bg-muted/50 rounded-md p-4 flex items-start gap-3 text-xs">
              <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-muted-foreground leading-relaxed">
                For your security, we verify your identity using your date of
                birth and send a one-time password to your registered phone
                number.
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="bg-muted/30 rounded-md p-4 space-y-2 text-sm">
              <p className="flex justify-between">
                <strong>ID Type:</strong>{" "}
                <span>
                  {idType === "national-id" ? "National ID" : "Personal Number"}
                </span>
              </p>
              <p className="flex justify-between">
                <strong>ID Number:</strong> <span>{idNumber}</span>
              </p>
              <p className="flex justify-between">
                <strong>Date of Birth:</strong> <span>{dob}</span>
              </p>
              <p className="flex justify-between">
                <strong>OTP sent to:</strong> <span>{maskedPhone}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium">
                One-Time Password (OTP)
              </Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="123456"
                maxLength={6}
                className="tracking-[0.3em] text-center text-lg font-mono focus:ring-primary h-12"
                required
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Check your phone for a 6-digit code.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {info && (
              <div className="flex items-start gap-2 text-sm text-primary bg-primary/10 rounded-md p-3">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{info}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 h-11 text-base"
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep("enter-id");
                  setOtp("");
                  setSessionToken("");
                  setMaskedPhone("");
                  setError(null);
                  setInfo(null);
                }}
                className="flex-1 h-10"
              >
                Change Details
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleResendOtp}
                className="flex-1 bg-secondary text-primary hover:bg-secondary/80 h-10"
              >
                Resend OTP
              </Button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline font-medium"
                  onClick={() =>
                    setInfo("Please check your phone or contact support.")
                  }
                >
                  Get help
                </button>
              </p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
