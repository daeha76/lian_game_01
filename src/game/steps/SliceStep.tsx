"use client";

import { useEffect, useState } from "react";
import type { SliceStep as SliceStepData, StepProps } from "../types";
import { SHELL_FILL } from "../CookedFood";
import styles from "./steps.module.css";

const CAKE_FILL = "#ffe0a0";
const CAKE_EDGE = "#c48538";

export default function SliceStep({ step, recipe, onComplete, setMessage }: StepProps<SliceStepData>) {
  const [count, setCount] = useState(0);
  const color = recipe.spreadColor ?? "pink";
  const cream = SHELL_FILL[color];
  const done = count >= step.target;
  const slices = step.target + 1;

  useEffect(() => {
    if (count === 0) return;
    if (done) {
      setMessage(`잘랐다! ${slices}조각 완성! 🎉`);
      const t = setTimeout(onComplete, 800);
      return () => clearTimeout(t);
    }
    setMessage(`슥슥~ ${count}/${step.target}`);
  }, [count, done, slices, step.target, setMessage, onComplete]);

  function handle() {
    setCount((p) => (p >= step.target ? p : p + 1));
  }

  const sliceBg = `repeating-radial-gradient(circle,
    ${CAKE_FILL} 0px,
    ${CAKE_FILL} 6px,
    ${cream} 6px,
    ${cream} 10px)`;

  return (
    <div className={styles.sliceLayout} onClick={handle}>
      {done ? (
        <div className={styles.sliceRow}>
          {Array.from({ length: slices }).map((_, i) => (
            <div
              key={i}
              className={styles.rollPiece}
              style={{ background: sliceBg, borderColor: CAKE_EDGE }}
            />
          ))}
        </div>
      ) : (
        <div
          className={styles.rollLog}
          style={{ background: sliceBg, borderColor: CAKE_EDGE }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={styles.cutLine}
              style={{ left: `${((i + 1) / slices) * 100}%` }}
            />
          ))}
        </div>
      )}
      <span className={styles.knife}>🔪</span>
    </div>
  );
}
