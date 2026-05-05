"use client";

import { useEffect, useState } from "react";
import type { PipeStep as PS, StepProps } from "../types";
import { SHELL_FILL, SHELL_EDGE } from "../CookedFood";
import styles from "./steps.module.css";

/** 짜기: 짜주머니를 클릭해서 쟁반/틀에 반죽을 N개 짜기. shape="bear"면 곰모양(하리보) */
export default function PipeStep({ step, recipe, onComplete, setMessage }: StepProps<PS>) {
  const [placed, setPlaced] = useState(0);
  const color = recipe.spreadColor ?? "pink";
  const fill = SHELL_FILL[color];
  const edge = SHELL_EDGE[color];
  const isBear = step.shape === "bear";

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
      <div className={isBear ? styles.pipeBearTray : styles.pipeTray}>
        {Array.from({ length: step.count }).map((_, i) => {
          const filled = i < placed;
          if (isBear) {
            return (
              <GummyBearSlot key={i} filled={filled} fill={fill} edge={edge} />
            );
          }
          return (
            <div
              key={i}
              className={styles.pipeSlot}
              style={
                filled
                  ? {
                      background: `radial-gradient(circle at 35% 30%, ${fill}, ${edge})`,
                      boxShadow: `inset -3px -3px 0 rgba(0,0,0,0.1)`,
                    }
                  : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}

function GummyBearSlot({ filled, fill, edge }: { filled: boolean; fill: string; edge: string }) {
  const bodyFill = filled ? fill : "rgba(0,0,0,0.08)";
  const bodyStroke = filled ? edge : "rgba(0,0,0,0.18)";
  const eyeColor = filled ? edge : "transparent";
  return (
    <div className={styles.pipeBearSlot}>
      <svg viewBox="0 0 60 64" width="100%" height="100%" aria-hidden>
        <g fill={bodyFill} stroke={bodyStroke} strokeWidth="2" strokeLinejoin="round">
          {/* 귀 */}
          <circle cx="18" cy="10" r="6" />
          <circle cx="42" cy="10" r="6" />
          {/* 머리 */}
          <circle cx="30" cy="19" r="11" />
          {/* 몸통 */}
          <ellipse cx="30" cy="42" rx="16" ry="14" />
          {/* 팔 */}
          <circle cx="11" cy="38" r="6" />
          <circle cx="49" cy="38" r="6" />
          {/* 다리 */}
          <circle cx="20" cy="58" r="5" />
          <circle cx="40" cy="58" r="5" />
        </g>
        {/* 눈/코 — 채워졌을 때만 살짝 보이게 */}
        <g fill={eyeColor}>
          <circle cx="25" cy="18" r="1.2" />
          <circle cx="35" cy="18" r="1.2" />
          <circle cx="30" cy="22" r="1" />
        </g>
      </svg>
    </div>
  );
}
