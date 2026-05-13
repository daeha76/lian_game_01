"use client";

import { useEffect, useRef, useState } from "react";
import type { SliceStep as SliceStepData, StepProps } from "../types";
import { SHELL_FILL, SPONGE_FILL, SPONGE_EDGE, RollCakeSlice } from "../CookedFood";
import { useDraggable } from "../useDrag";
import styles from "./steps.module.css";

export default function SliceStep({ step, recipe, onComplete, setMessage }: StepProps<SliceStepData>) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"cutting" | "separated">("cutting");
  const knifeRef = useRef<HTMLSpanElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const color = recipe.spreadColor ?? "pink";
  const cream = SHELL_FILL[color];
  const slices = step.target + 1;
  const done = count >= step.target;
  const remaining = slices - count;

  function handleCut() {
    setCount((p) => Math.min(p + 1, step.target));
    const knife = knifeRef.current;
    if (knife) {
      knife.style.transition = "transform 0.4s ease";
      knife.style.transform = "";
      const tid = window.setTimeout(() => {
        if (knife) knife.style.transition = "";
      }, 420);
      return () => window.clearTimeout(tid);
    }
  }

  useDraggable(
    knifeRef,
    () => (logRef.current ? [{ el: logRef.current, onDrop: handleCut }] : []),
    !done && phase === "cutting",
  );

  useEffect(() => {
    if (count === 0) {
      setMessage("칼을 빵 위로 끌어다 놓아봐! 🔪");
      return;
    }
    if (!done) {
      setMessage(`슥슥~ 한 번 더 자르자! ${count}/${step.target}`);
      return;
    }
    setMessage(`${slices}조각 완성! 🎉`);
    const tSep = window.setTimeout(() => setPhase("separated"), 1000);
    const tDone = window.setTimeout(onComplete, 2000);
    return () => {
      window.clearTimeout(tSep);
      window.clearTimeout(tDone);
    };
  }, [count, done, slices, step.target, setMessage, onComplete]);

  const logBg = `repeating-radial-gradient(circle,
    ${SPONGE_FILL} 0px,
    ${SPONGE_FILL} 6px,
    ${cream} 6px,
    ${cream} 10px)`;

  return (
    <div className={styles.sliceLayout}>
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
              ref={logRef}
              className={styles.rollLogShrink}
              style={{
                width: `${remaining}em`,
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
      {phase === "cutting" && (
        <span ref={knifeRef} className={styles.knifeDraggable}>🔪</span>
      )}
    </div>
  );
}
