"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MouseEvent,
  PropsWithChildren,
  startTransition,
  useEffect,
  useRef,
  useState,
} from "react";
import { emitArchiveGlitch } from "./archive-title";

const NAVIGATION_GLITCH_DELAY_MS = 500;

type GlitchLinkProps = PropsWithChildren<{
  className?: string;
  href: string;
}>;

export function GlitchLink({ children, className, href, ...props }: GlitchLinkProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
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

    if (isPending) {
      return;
    }

    emitArchiveGlitch();
    setIsPending(true);

    timeoutRef.current = window.setTimeout(() => {
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
      aria-disabled={isPending}
      className={`${className ?? ""} ${isPending ? "is-glitch-pending" : ""}`.trim()}
    >
      {children}
    </Link>
  );
}
