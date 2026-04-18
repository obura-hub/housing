"use client";

import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { EmployeeVerificationModal } from "./EmployeeVerificationModal";

interface VerifyEmployeeButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function VerifyEmployeeButton({
  children,
  ...buttonProps
}: VerifyEmployeeButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button {...buttonProps} onClick={() => setModalOpen(true)}>
        {children}
      </Button>
      <EmployeeVerificationModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
