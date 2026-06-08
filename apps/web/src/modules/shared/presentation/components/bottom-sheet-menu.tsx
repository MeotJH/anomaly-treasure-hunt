"use client";

import { usePathname } from "next/navigation";
import { GlitchLink } from "./glitch-link";

interface MenuItem {
  href: string;
  label: string;
}

export function BottomSheetMenu({
  items,
}: {
  items: MenuItem[];
  userEmail: string | null;
  isAdmin: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-rose-900/40 bg-[linear-gradient(180deg,rgba(18,10,13,0.92),rgba(6,7,10,0.98))] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.85rem)] pt-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center justify-center gap-2">
        {items.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <GlitchLink
              key={item.href}
              href={item.href}
              className={`bottom-nav-link menu-glitch-link min-w-0 flex-1 rounded-2xl border px-3 py-3 text-center text-sm font-medium ${
                isActive
                  ? "border-rose-400/30 bg-rose-500/12 text-rose-50"
                  : "border-white/10 bg-black/20 text-zinc-300"
              }`}
            >
              <span className="block truncate">{item.label}</span>
            </GlitchLink>
          );
        })}
      </div>
    </nav>
  );
}
