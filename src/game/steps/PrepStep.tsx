"use client";

import { useEffect, useState } from "react";
import type { PrepStep as PS, StepProps, PrepKind } from "../types";
import { EMOJI_IMAGES } from "../images";
import styles from "./steps.module.css";

const TOOL_EMOJI: Record<PrepKind, string> = {
  wash: "💧",
  trim: "🔪",
  chop: "🔪",
};

const PROGRESS_VERB: Record<PrepKind, string> = {
  wash: "씻는 중",
  trim: "손질하는 중",
  chop: "자르는 중",
};

const DONE_MSG: Record<PrepKind, string> = {
  wash: "깨끗해졌어요! ✨",
  trim: "손질 끝! 👍",
  chop: "잘게 잘렸어요! 🎉",
};

export default function PrepStep({ step, onComplete, setMessage }: StepProps<PS>) {
  const [taps, setTaps] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const done = taps >= step.target;

  useEffect(() => {
    if (taps === 0) return;
    if (done) {
      setMessage(DONE_MSG[step.kind]);
      const t = setTimeout(onComplete, 700);
      return () => clearTimeout(t);
    }
    setMessage(`${PROGRESS_VERB[step.kind]}... ${taps}/${step.target}`);
  }, [taps, done, step.target, step.kind, setMessage, onComplete]);

  function handle() {
    if (done) return;
    setTaps((p) => Math.min(p + 1, step.target));
    setAnimKey((p) => p + 1);
  }

  const ratio = taps / step.target;
  const showPieces = step.kind === "chop" && taps > 0;
  const imgSrc = EMOJI_IMAGES[step.emoji];

  return (
    <div className={styles.prepLayout} onClick={handle}>
      {step.kind === "wash" && (
        <div className={styles.prepWashBowl}>
          <div
            className={styles.prepWashWater}
            style={{ opacity: 0.4 + ratio * 0.5 }}
          />
        </div>
      )}
      {step.kind !== "wash" && (
        <div className={styles.prepBoard} />
      )}
      <div className={styles.prepFruitWrap}>
        {showPieces ? (
          <div className={styles.prepPieces}>
            {Array.from({ length: Math.min(taps + 1, 6) }).map((_, i) => {
              const transform = `translate(${(i - 2.5) * 22}px, ${(i % 2) * 8}px) rotate(${i * 30}deg) scale(${0.55 + (i % 2) * 0.15})`;
              return imgSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={imgSrc}
                  alt=""
                  className={`${styles.prepPiece} ${styles.prepPieceImg}`}
                  style={{ transform }}
                />
              ) : (
                <span
                  key={i}
                  className={styles.prepPiece}
                  style={{ transform }}
                >
                  {step.emoji}
                </span>
              );
            })}
          </div>
        ) : imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={animKey}
            src={imgSrc}
            alt=""
            className={`${styles.prepFruit} ${styles.prepFruitTap} ${styles.prepFruitImg}`}
          />
        ) : (
          <span
            key={animKey}
            className={`${styles.prepFruit} ${styles.prepFruitTap}`}
          >
            {step.emoji}
          </span>
        )}
      </div>
      <span className={styles.prepTool}>{TOOL_EMOJI[step.kind]}</span>
    </div>
  );
}
