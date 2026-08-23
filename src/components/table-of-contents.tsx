"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

// How far from the top of the viewport a heading counts as "reached" —
// roughly the sticky nav height plus a little buffer.
const ACTIVE_OFFSET_PX = 120;

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const headingEls = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingEls.length === 0) return;

    // Recomputed from live geometry (not just intersection-change events) so
    // it stays correct after instant jumps/anchor clicks, not just smooth
    // scrolling through every heading in order.
    function updateActive() {
      let current = headingEls[0].id;
      for (const el of headingEls) {
        if (el.getBoundingClientRect().top <= ACTIVE_OFFSET_PX) {
          current = el.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    }

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="absolute -left-96 hidden w-64 min-[1400px]:block">
      <div className="fixed left-[calc(50%-672px)] top-28 z-10 w-64">
        <div className="max-h-[calc(100vh-8rem)] overflow-auto rounded-lg border border-border bg-background/70 p-4 backdrop-blur-sm">
          <h4 className="mb-3 text-sm font-semibold text-muted-foreground">On this page</h4>
          <ul className="space-y-2.5 text-sm">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`block leading-snug transition-colors ${
                    activeId === item.id
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
