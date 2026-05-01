"use client";

import { useEffect, useRef } from "react";

export interface DropTarget {
  el: HTMLElement;
  onDrop: () => void;
}

/**
 * Pointer Events 기반 드래그&드롭 훅. PC, 태블릿, 모바일 통합.
 *
 * - 드래그 중에는 source에 .dragging 클래스, 드롭 타겟에 .drop-zone-active 클래스가 붙음 (globals.css)
 * - 드롭 영역에 떨어뜨리면 onDrop 호출, 아니면 부드럽게 원위치
 */
export function useDraggable<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>,
  getDropTargets: () => DropTarget[],
  enabled: boolean = true,
) {
  const targetsFn = useRef(getDropTargets);
  targetsFn.current = getDropTargets;

  useEffect(() => {
    const source = ref.current;
    if (!source || !enabled) return;

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let pointerId: number | null = null;
    let activeTargets: DropTarget[] = [];

    function onDown(e: PointerEvent) {
      e.preventDefault();
      dragging = true;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      try { source!.setPointerCapture(pointerId); } catch {}
      source!.classList.add("dragging");
      activeTargets = targetsFn.current();
      activeTargets.forEach((t) => t.el.classList.add("drop-zone-active"));
    }

    function onMove(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      source!.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`;
    }

    function endDrag(e: PointerEvent | null, cancelled: boolean) {
      if (!dragging) return;
      dragging = false;
      if (pointerId !== null) {
        try { source!.releasePointerCapture(pointerId); } catch {}
      }
      source!.classList.remove("dragging");
      activeTargets.forEach((t) => t.el.classList.remove("drop-zone-active"));

      let matched: DropTarget | null = null;
      if (!cancelled && e) {
        source!.style.visibility = "hidden";
        const dropEl = document.elementFromPoint(e.clientX, e.clientY);
        source!.style.visibility = "";
        for (const t of activeTargets) {
          if (t.el === dropEl || (dropEl && t.el.contains(dropEl))) {
            matched = t;
            break;
          }
        }
      }

      if (matched) {
        matched.onDrop();
      } else {
        source!.style.transition = "transform 0.4s ease";
        source!.style.transform = "";
        const onEnd = () => {
          source!.style.transition = "";
          source!.removeEventListener("transitionend", onEnd);
        };
        source!.addEventListener("transitionend", onEnd);
      }
      activeTargets = [];
    }

    const onUp = (e: PointerEvent) => endDrag(e, false);
    const onCancel = (e: PointerEvent) => endDrag(e, true);

    source.style.touchAction = "none";
    source.addEventListener("pointerdown", onDown);
    source.addEventListener("pointermove", onMove);
    source.addEventListener("pointerup", onUp);
    source.addEventListener("pointercancel", onCancel);

    return () => {
      source.removeEventListener("pointerdown", onDown);
      source.removeEventListener("pointermove", onMove);
      source.removeEventListener("pointerup", onUp);
      source.removeEventListener("pointercancel", onCancel);
    };
  }, [ref, enabled]);
}
