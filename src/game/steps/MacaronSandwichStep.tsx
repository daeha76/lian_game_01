"use client";

import { useEffect, useState } from "react";
import type { MacaronSandwichStep as MSS, StepProps } from "../types";
import { MacaronShape, SHELL_FILL, SHELL_EDGE } from "../CookedFood";
import styles from "./steps.module.css";

type PairState = "empty" | "creamed" | "done";

/** 3쌍의 마카롱 껍질에 크림 발라 합체 */
export default function MacaronSandwichStep({ step, recipe, onComplete, setMessage }: StepProps<MSS>) {
  const total = step.pairs;
  const [states, setStates] = useState<PairState[]>(() => Array(total).fill("empty"));
  const fill = SHELL_FILL[step.color];
  const edge = SHELL_EDGE[step.color];
  const color = recipe.spreadColor ?? step.color;

  const doneCount = states.filter((s) => s === "done").length;

  useEffect(() => {
    if (doneCount >= total) {
      setMessage(`마카롱 ${total}개 완성! 🎉`);
      const t = setTimeout(onComplete, 900);
      return () => clearTimeout(t);
    }
    if (doneCount === 0) {
      setMessage(`마카롱을 콕콕 눌러 크림 발라봐!`);
    } else {
      setMessage(`${doneCount}/${total} 완성!`);
    }
  }, [doneCount, total, onComplete, setMessage]);

  function handleTap(i: number) {
    setStates((prev) => {
      if (prev[i] === "done") return prev;
      const next = [...prev];
      if (prev[i] === "empty") {
        next[i] = "creamed";
        setTimeout(() => {
          setStates((curr) => {
            const c = [...curr];
            if (c[i] === "creamed") c[i] = "done";
            return c;
          });
        }, 450);
      }
      return next;
    });
  }

  return (
    <div className={styles.sandwichLayout}>
      {states.map((s, i) =>
        s === "done" ? (
          <div key={i} className={styles.sandwichDone}>
            <MacaronShape color={color} />
          </div>
        ) : (
          <div key={i} className={styles.sandwichPair} onClick={() => handleTap(i)}>
            <Shell fill={fill} edge={edge} bottom={false} />
            <div
              className={styles.sandwichCream}
              style={{
                opacity: s === "creamed" ? 1 : 0,
                transform: s === "creamed" ? "scaleY(1)" : "scaleY(0)",
              }}
            />
            <Shell fill={fill} edge={edge} bottom={true} />
          </div>
        ),
      )}
    </div>
  );
}

function Shell({ fill, edge, bottom }: { fill: string; edge: string; bottom: boolean }) {
  return (
    <svg width="80" height="32" viewBox="0 0 80 32" style={{ display: "block" }}>
      <ellipse cx="40" cy="16" rx="36" ry="13" fill={fill} stroke={edge} strokeWidth="2" />
      <g fill={edge} opacity="0.5">
        {bottom ? (
          <>
            <circle cx="10" cy="6"  r="2" />
            <circle cx="22" cy="3"  r="2" />
            <circle cx="40" cy="2"  r="2" />
            <circle cx="58" cy="3"  r="2" />
            <circle cx="70" cy="6"  r="2" />
          </>
        ) : (
          <>
            <circle cx="10" cy="26" r="2" />
            <circle cx="22" cy="29" r="2" />
            <circle cx="40" cy="30" r="2" />
            <circle cx="58" cy="29" r="2" />
            <circle cx="70" cy="26" r="2" />
          </>
        )}
      </g>
      <ellipse cx="28" cy="10" rx="9" ry="2.5" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}
