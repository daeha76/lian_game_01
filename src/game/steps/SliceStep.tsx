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
    // 두 번째 컷이 살짝 보이도록 잠깐 머문 뒤 분리
    setMessage("슥슥~ 잘랐다!");
    const tSep = setTimeout(() => {
      setPhase("separated");
      setMessage(`${slices}조각 완성! 🎉`);
    }, 900);
    const tDone = setTimeout(onComplete, 1900);
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
        <div
          className={styles.rollLog}
          style={{ background: logBg, borderColor: SPONGE_EDGE }}
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
