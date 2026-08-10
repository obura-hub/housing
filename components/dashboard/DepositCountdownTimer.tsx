"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DepositCountdownTimerProps {
  reservedAt: string; // ISO date string
  deadlineDays?: number; // default 2
  className?: string;
}

export function DepositCountdownTimer({
  reservedAt,
  deadlineDays = 2,
  className,
}: DepositCountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  } | null>(null);
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const deadline =
      new Date(reservedAt).getTime() + deadlineDays * 24 * 60 * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        setIsOverdue(true);
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, totalMs: diff });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [reservedAt, deadlineDays]);

  if (isOverdue) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-red-600 font-medium",
          className,
        )}
      >
        <AlertCircle className="h-4 w-4" />
        <span>Deposit deadline passed – please pay immediately</span>
      </div>
    );
  }

  if (!timeLeft) return null;

  const { days, hours, minutes, seconds, totalMs } = timeLeft;

  // Compute progress (0% = just reserved, 100% = deadline reached)
  const totalDuration = deadlineDays * 24 * 60 * 60 * 1000;
  const progress = ((totalDuration - totalMs) / totalDuration) * 100;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4 text-amber-600" />
        <span className="font-medium text-amber-700">
          Time left to pay deposit:
        </span>
      </div>
      <div className="flex items-center gap-3 text-lg font-mono font-bold tabular-nums">
        {days > 0 && <span>{days}d</span>}
        <span>{String(hours).padStart(2, "0")}h</span>
        <span>{String(minutes).padStart(2, "0")}m</span>
        <span>{String(seconds).padStart(2, "0")}s</span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 transition-all duration-1000"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {progress > 75 && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Deadline approaching – make payment soon!
        </p>
      )}
    </div>
  );
}
