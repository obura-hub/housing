"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EmployeeVerificationModal } from "./EmployeeVerificationModal";

export function AutoVerifyModal() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchParams?.get("verify") === "true") {
      setOpen(true);
      // Remove the param from URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("verify");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  return <EmployeeVerificationModal open={open} onOpenChange={setOpen} />;
}
