"use client";

import { useEffect, useState } from "react";
import type { KneadStep, RollStep, StepProps } from "../types";
import styles from "./steps.module.css";

export default function DoughStep({ step, onComplete, setMessage }: StepProps<KneadStep | RollStep>) {
  const [count, setCount] = useState(0);
  const isRoll = step.type === "roll";

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

  return <div className={styles.dough} style={style} onClick={handle} />;
}
