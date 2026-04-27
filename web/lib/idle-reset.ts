"use client";

import { useEffect, useRef, useState } from "react";
import { useExhibitStore } from "./store";

const DEFAULT_IDLE_MS = 5 * 60 * 1000; // 5 minutes
const CONFIRM_SECONDS = 30;

const ACTIVITY_EVENTS = ["mousemove", "keydown", "pointerdown", "touchstart", "wheel"] as const;

/**
 * Tracks user inactivity and surfaces a 30-second confirmation prompt
 * before performing a hard reset.
 */
export function useIdleReset(idleMs: number = DEFAULT_IDLE_MS) {
  const manualReset = useExhibitStore((s) => s.manualReset);
  const [confirming, setConfirming] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CONFIRM_SECONDS);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const envIdle = Number(process.env.NEXT_PUBLIC_IDLE_MS);
    const effectiveIdle = Number.isFinite(envIdle) && envIdle > 0 ? envIdle : idleMs;

    const goIdle = () => {
      setConfirming(true);
      setSecondsLeft(CONFIRM_SECONDS);
      tick.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            if (tick.current) clearInterval(tick.current);
            manualReset();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    };

    const reset = () => {
      if (confirming) return; // pause the activity-resets while prompt is up
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(goIdle, effectiveIdle);
    };

    reset();
    for (const ev of ACTIVITY_EVENTS) window.addEventListener(ev, reset, { passive: true });
    return () => {
      for (const ev of ACTIVITY_EVENTS) window.removeEventListener(ev, reset);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (tick.current) clearInterval(tick.current);
    };
  }, [idleMs, manualReset, confirming]);

  const dismiss = () => {
    if (tick.current) clearInterval(tick.current);
    setConfirming(false);
    setSecondsLeft(CONFIRM_SECONDS);
  };
  const confirm = () => {
    if (tick.current) clearInterval(tick.current);
    manualReset();
  };

  return { confirming, secondsLeft, dismiss, confirm };
}
