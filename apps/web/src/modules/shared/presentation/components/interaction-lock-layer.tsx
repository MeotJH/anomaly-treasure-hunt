"use client";

import { useInteractionLock } from "./interaction-lock-context";

export function InteractionLockLayer() {
  const { isLocked, message } = useInteractionLock();

  if (!isLocked) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[45] bg-[rgba(6,7,10,0.16)] backdrop-blur-[1.5px]"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center px-4">
        <div className="inline-flex items-center gap-3 rounded-full border border-rose-400/18 bg-[rgba(18,10,13,0.9)] px-4 py-2 text-sm text-rose-100 shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-300" />
          <span>{message ?? "보고서를 전송하는 중입니다..."}</span>
        </div>
      </div>
    </div>
  );
}
