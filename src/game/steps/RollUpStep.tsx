"use client";

import { useEffect, useRef, useState } from "react";
import type { RollUpStep as RollUpStepData, StepProps } from "../types";
import { SHELL_FILL, SHELL_EDGE } from "../CookedFood";
import styles from "./steps.module.css";

const CAKE_FILL = "#ffe0a0";
const CAKE_EDGE = "#c48538";
// 한 바퀴 굴리는 데 필요한 마우스 이동 거리 (px) — WhiskStep 패턴
const MOVE_PER_UNIT = 360;

export default function RollUpStep({ step, recipe, onComplete, setMessage }: StepProps<RollUpStepData>) {
  const [count, setCount] = useState(0);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);
  const accRef = useRef(0);
  const color = recipe.spreadColor ?? "pink";
  const cream = SHELL_FILL[color];
  const creamEdge = SHELL_EDGE[color];

  useEffect(() => {
    if (count === 0) {
      setMessage("마우스를 휘휘 저어서 돌돌 말아봐! 🌀");
      return;
    }
    setMessage(`돌돌~ ${count}/${step.target}`);
    if (count >= step.target && !doneRef.current) {
      doneRef.current = true;
      const t = setTimeout(onComplete, 700);
      return () => clearTimeout(t);
    }
  }, [count, step.target, setMessage, onComplete]);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    let down = false;
    let lastX = 0;
    let lastY = 0;

    function onDown(e: PointerEvent) {
      e.preventDefault();
      down = true;
      lastX = e.clientX;
      lastY = e.clientY;
      try { surface!.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    }
    function onMove(e: PointerEvent) {
      if (!down || doneRef.current) return;
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      accRef.current += dist;
      const gained = Math.floor(accRef.current / MOVE_PER_UNIT);
      if (gained > 0) {
        accRef.current -= gained * MOVE_PER_UNIT;
        setCount((p) => (doneRef.current ? p : Math.min(p + gained, step.target)));
      }
      lastX = e.clientX;
      lastY = e.clientY;
    }
    function onUp() { down = false; }

    surface.addEventListener("pointerdown", onDown);
    surface.addEventListener("pointermove", onMove);
    surface.addEventListener("pointerup", onUp);
    surface.addEventListener("pointercancel", onUp);
    return () => {
      surface.removeEventListener("pointerdown", onDown);
      surface.removeEventListener("pointermove", onMove);
      surface.removeEventListener("pointerup", onUp);
      surface.removeEventListener("pointercancel", onUp);
    };
  }, [step.target]);

  const progress = count / step.target;
  const sheetWidth = Math.max(0, (1 - progress) * 260);
  const rollSize = progress > 0 ? 70 + progress * 110 : 0;

  return (
    <div ref={surfaceRef} className={styles.rollUpLayout}>
      {sheetWidth > 2 && (
        <div
          className={styles.rollUpSheet}
          style={{
            width: sheetWidth,
            background: `
              linear-gradient(180deg,
                ${cream} 0%,
                ${cream} 34%,
                ${creamEdge}aa 34%,
                ${creamEdge}aa 38%,
                ${CAKE_FILL} 38%,
                ${CAKE_EDGE} 100%)`,
            borderRight: count > 0 ? `3px solid ${CAKE_EDGE}` : "none",
          }}
        />
      )}
      {rollSize > 0 && (
        <div
          className={styles.rollUpRoll}
          style={{
            width: rollSize,
            height: rollSize,
            background: `repeating-radial-gradient(circle,
              ${CAKE_FILL} 0px,
              ${CAKE_FILL} 7px,
              ${cream} 7px,
              ${cream} 11px)`,
            borderColor: CAKE_EDGE,
            transform: `rotate(${progress * 540}deg)`,
          }}
        />
      )}
    </div>
  );
}
