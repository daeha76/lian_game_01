"use client";

import { useEffect, useState } from "react";
import type { KneadStep, RollStep, StepProps } from "../types";
import { SHELL_FILL, SHELL_EDGE } from "../CookedFood";
import styles from "./steps.module.css";

export default function DoughStep({ step, recipe, onComplete, setMessage }: StepProps<KneadStep | RollStep>) {
  const [count, setCount] = useState(0);
  const isRoll = step.type === "roll";
  const isMacaron = recipe.category === "macaron";
  const color = recipe.spreadColor ?? "pink";

  useEffect(() => {
    if (count === 0) return;
    setMessage(isRoll ? `밀어밀어! ${count}/${step.target}` : `조물조물! ${count}/${step.target}`);
    if (count >= step.target) {
      const t = setTimeout(onComplete, 500);
      return () => clearTimeout(t);
    }
  }, [count, step.target, isRoll, setMessage, onComplete]);

  function handle() {
    setCount((prev) => (prev >= step.target ? prev : prev + 1));
  }

  const style: React.CSSProperties = isRoll
    ? {
        transform: `scaleY(${0.85 - count * 0.1}) scaleX(${1 + count * 0.08})`,
        borderRadius: `${50 - count * 8}%`,
      }
    : { transform: `scale(${1 - count * 0.05}, ${1 + count * 0.03})` };

  if (isMacaron) {
    return (
      <div
        className={styles.coloredDough}
        style={{
          ...style,
          background: `radial-gradient(circle at 35% 30%, ${SHELL_FILL[color]}, ${SHELL_EDGE[color]})`,
          boxShadow: `inset -10px -10px 0 rgba(0,0,0,0.08), 0 8px 16px ${SHELL_EDGE[color]}55`,
        }}
        onClick={handle}
      />
    );
  }

  return <div className={styles.doughImg} style={style} onClick={handle} />;
}
