"use client";

import { useEffect, useState } from "react";
import type { PipeStep as PS, StepProps } from "../types";
import { SHELL_FILL, SHELL_EDGE } from "../CookedFood";
import styles from "./steps.module.css";

/** 짜기: 짜주머니를 클릭해서 쟁반에 마카롱 반죽 N개를 짜기 */
export default function PipeStep({ step, recipe, onComplete, setMessage }: StepProps<PS>) {
  const [placed, setPlaced] = useState(0);
  const color = recipe.spreadColor ?? "pink";
  const fill = SHELL_FILL[color];
  const edge = SHELL_EDGE[color];

  useEffect(() => {
    if (placed === 0) return;
    if (placed >= step.count) {
      setMessage(`${step.count}개 다 짰어! 🎉`);
      const t = setTimeout(onComplete, 700);
      return () => clearTimeout(t);
    }
    setMessage(`${placed}/${step.count} — 계속 짜봐!`);
  }, [placed, step.count, onComplete, setMessage]);

  function handleTap() {
    setPlaced((p) => Math.min(p + 1, step.count));
  }

  return (
    <div className={styles.pipeLayout}>
      <div
        className={styles.pipingBag}
        onClick={handleTap}
        style={{ background: `linear-gradient(180deg, #fff 0%, ${fill} 100%)`, borderColor: edge }}
      >
        <div className={styles.pipingBagTip} style={{ borderTopColor: edge }} />
      </div>
      <div className={styles.pipeTray}>
        {Array.from({ length: step.count }).map((_, i) => (
          <div
            key={i}
            className={styles.pipeSlot}
            style={
              i < placed
                ? {
                    background: `radial-gradient(circle at 35% 30%, ${fill}, ${edge})`,
                    boxShadow: `inset -3px -3px 0 rgba(0,0,0,0.1)`,
                  }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
