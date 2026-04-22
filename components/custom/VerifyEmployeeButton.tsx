"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@/components/ui/button";
import { EmployeeVerificationModal } from "./EmployeeVerificationModal";

interface VerifyEmployeeButtonProps extends ButtonProps {
  children: React.ReactNode;
  userId?: string; // optional: if provided, user is already logged in
  redirectTo?: string; // where to go if already logged in (default: "/dashboard")
}

export function VerifyEmployeeButton({
  userId,
  redirectTo = "/dashboard",
  children,
  ...buttonProps
}: VerifyEmployeeButtonProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    if (userId) {
      router.push(redirectTo);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <Button {...buttonProps} onClick={handleClick}>
        {children}
      </Button>
      <EmployeeVerificationModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
