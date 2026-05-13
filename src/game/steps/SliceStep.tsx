"use client";

import { useEffect, useState } from "react";
import type { SliceStep as SliceStepData, StepProps } from "../types";
import { SHELL_FILL, SPONGE_FILL, SPONGE_EDGE, RollCakeSlice } from "../CookedFood";
import styles from "./steps.module.css";

export default function SliceStep({ step, recipe, onComplete, setMessage }: StepProps<SliceStepData>) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"cutting" | "separated">("cutting");
  const color = recipe.spreadColor ?? "pink";
  const cream = SHELL_FILL[color];
  const slices = step.target + 1;
  const done = count >= step.target;

  useEffect(() => {
    if (count === 0) return;
    if (!done) {
      setMessage(`슥슥~ ${count}/${step.target}`);
      return;
    }
    setMessage(`${slices}조각 완성! 🎉`);
    const tSep = setTimeout(() => setPhase("separated"), 1000);
    const tDone = setTimeout(onComplete, 2000);
    return () => {
      clearTimeout(tSep);
      clearTimeout(tDone);
    };
  }, [count, done, slices, step.target, setMessage, onComplete]);

  function handle() {
    setCount((p) => (p >= step.target ? p : p + 1));
  }

  const logBg = `repeating-radial-gradient(circle,
    ${SPONGE_FILL} 0px,
    ${SPONGE_FILL} 6px,
    ${cream} 6px,
    ${cream} 10px)`;

  // 본체 로그 너비: 자를수록 줄어들어 1 → (slices-1)/slices → ... → 1/slices
  // 1em = 한 조각 크기, 전체 로그는 slices em
  const remaining = slices - count;
  const logWidthEm = remaining;

  return (
    <div className={styles.sliceLayout} onClick={handle}>
      {phase === "separated" ? (
        <div className={styles.sliceRow}>
          {Array.from({ length: slices }).map((_, i) => (
            <span key={i} className={styles.rollPieceWrap}>
              <RollCakeSlice color={color} />
            </span>
          ))}
        </div>
      ) : (
        <div className={styles.sliceCuts}>
          {remaining > 0 && (
            <div
              className={styles.rollLogShrink}
              style={{
                width: `${logWidthEm}em`,
                background: logBg,
                borderColor: SPONGE_EDGE,
              }}
            />
          )}
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} className={styles.cutSlice}>
              <RollCakeSlice color={color} />
            </span>
          ))}
        </div>
      )}
      <span className={styles.knife}>🔪</span>
    </div>
  );
}
