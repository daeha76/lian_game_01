"use client";

import { useEffect, useState } from "react";
import type { RollUpStep as RollUpStepData, StepProps } from "../types";
import { SHELL_FILL, SHELL_EDGE } from "../CookedFood";
import styles from "./steps.module.css";

const CAKE_FILL = "#ffe0a0";
const CAKE_EDGE = "#c48538";

export default function RollUpStep({ step, recipe, onComplete, setMessage }: StepProps<RollUpStepData>) {
  const [count, setCount] = useState(0);
  const color = recipe.spreadColor ?? "pink";
  const cream = SHELL_FILL[color];
  const creamEdge = SHELL_EDGE[color];

  useEffect(() => {
    if (count === 0) return;
    setMessage(`돌돌~ ${count}/${step.target}`);
    if (count >= step.target) {
      const t = setTimeout(onComplete, 700);
      return () => clearTimeout(t);
    }
  }, [count, step.target, setMessage, onComplete]);

  function handle() {
    setCount((p) => (p >= step.target ? p : p + 1));
  }

  const progress = count / step.target;
  const sheetWidth = Math.max(0, (1 - progress) * 260);
  const rollSize = progress > 0 ? 70 + progress * 110 : 0;

  return (
    <div className={styles.rollUpLayout} onClick={handle}>
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
