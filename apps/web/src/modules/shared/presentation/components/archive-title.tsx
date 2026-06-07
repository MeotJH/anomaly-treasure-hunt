"use client";

import { useEffect } from "react";

const ARCHIVE_GLITCH_EVENT = "archive-glitch";
const GLITCH_DURATION_MS = 500;

export function emitArchiveGlitch() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(ARCHIVE_GLITCH_EVENT));
}

export function ArchiveGlitchFx() {
  useEffect(() => {
    const handleGlitch = () => {
      document.body.classList.remove("is-glitching");
      window.requestAnimationFrame(() => {
        document.body.classList.add("is-glitching");
      });

      window.setTimeout(() => {
        document.body.classList.remove("is-glitching");
      }, GLITCH_DURATION_MS);
    };

    window.addEventListener(ARCHIVE_GLITCH_EVENT, handleGlitch);

    return () => {
      window.removeEventListener(ARCHIVE_GLITCH_EVENT, handleGlitch);
      document.body.classList.remove("is-glitching");
    };
  }, []);

  return <div className="archive-glitch-overlay" aria-hidden="true" />;
}

export function ArchiveTitle({ title }: { title: string }) {
  return <span className="archive-terminal-title">{title}</span>;
}
