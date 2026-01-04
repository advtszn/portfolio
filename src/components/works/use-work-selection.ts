import { useState, useCallback, useEffect, useRef } from "react";

interface Identifiable {
  _id: string;
}

interface UseWorkSelectionOptions {
  onNavigate?: () => void;
}

const CLOSE_CURSOR = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg>") 12 12, pointer`;

export function useWorkSelection<T extends Identifiable>(
  options: UseWorkSelectionOptions = {},
) {
  const [hoveredItem, setHoveredItem] = useState<T | null>(null);
  const [lockedItem, setLockedItem] = useState<T | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayedItem = lockedItem || hoveredItem;

  const clear = useCallback(() => {
    setLockedItem(null);
    setHoveredItem(null);
  }, []);

  const isOutsideContainer = useCallback(
    (target: EventTarget | null) =>
      containerRef.current && !containerRef.current.contains(target as Node),
    [],
  );

  // Click outside to clear
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (isOutsideContainer(e.target)) clear();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOutsideContainer, clear]);

  // Show close cursor when locked and hovering outside
  useEffect(() => {
    if (!lockedItem) return;

    const handler = (e: MouseEvent) => {
      document.body.style.cursor = isOutsideContainer(e.target)
        ? CLOSE_CURSOR
        : "";
    };
    document.addEventListener("mousemove", handler);
    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", handler);
    };
  }, [lockedItem, isOutsideContainer]);

  const select = useCallback(
    (item: T, hasLink: boolean): { shouldNavigate: boolean } => {
      const isCurrentlyLocked = lockedItem?._id === item._id;

      if (isCurrentlyLocked && hasLink) {
        clear();
        options.onNavigate?.();
        return { shouldNavigate: true };
      }

      setLockedItem(item);
      setHoveredItem(item);
      return { shouldNavigate: false };
    },
    [lockedItem, clear, options],
  );

  const hover = useCallback(
    (item: T) => {
      if (!lockedItem) setHoveredItem(item);
    },
    [lockedItem],
  );

  const unhover = useCallback(() => {
    if (!lockedItem) setHoveredItem(null);
  }, [lockedItem]);

  return {
    containerRef,
    displayedItem,
    isLocked: lockedItem !== null,
    isItemActive: (item: T) => displayedItem?._id === item._id,
    select,
    hover,
    unhover,
  };
}
