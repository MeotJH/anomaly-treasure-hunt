"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MouseEvent,
  PropsWithChildren,
  startTransition,
  useEffect,
  useRef,
  useState,
} from "react";
import { emitArchiveGlitch } from "./archive-title";
import { useInteractionLock } from "./interaction-lock-context";

const NAVIGATION_GLITCH_DELAY_MS = 500;
const NAVIGATION_GLITCH_REPEAT_MS = 650;

type GlitchLinkProps = PropsWithChildren<{
  className?: string;
  href: string;
  allowWhileLocked?: boolean;
}>;

export function GlitchLink({
  children,
  className,
  href,
  allowWhileLocked = false,
  ...props
}: GlitchLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLocked } = useInteractionLock();
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  function clearPendingEffects() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    setIsPending(false);
    clearPendingEffects();
  }, [pathname]);

  useEffect(() => {
    return () => {
      clearPendingEffects();
    };
  }, []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    if ((isLocked && !allowWhileLocked) || isPending || pathname === href) {
      return;
    }

    emitArchiveGlitch();
    setIsPending(true);
    intervalRef.current = window.setInterval(() => {
      emitArchiveGlitch();
    }, NAVIGATION_GLITCH_REPEAT_MS);

    timeoutRef.current = window.setTimeout(() => {
      if (href.startsWith("#")) {
        window.location.hash = href.slice(1);
        setIsPending(false);
        clearPendingEffects();
        return;
      }

      startTransition(() => {
        router.push(href);
      });
    }, NAVIGATION_GLITCH_DELAY_MS);
  };

  return (
    <Link
      {...props}
      href={href}
      onClick={handleClick}
      aria-disabled={isPending || (isLocked && !allowWhileLocked)}
      className={`${className ?? ""} ${isPending ? "is-glitch-pending" : ""} ${
        isLocked && !allowWhileLocked ? "pointer-events-none opacity-45 saturate-50" : ""
      }`.trim()}
    >
      {children}
    </Link>
  );
}
