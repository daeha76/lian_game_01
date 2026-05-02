"use client";

import { useState, useEffect } from "react";
import { EMOJI_IMAGES } from "../images";
import type { PourStep as PS, StepProps } from "../types";
import styles from "./steps.module.css";

export default function PourStep({ step, onComplete, setMessage }: StepProps<PS>) {
  const [taps, setTaps] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [streaming, setStreaming] = useState(false);
  const done = taps >= step.taps;

  useEffect(() => {
    if (taps === 0) return;
    if (done) {
      setMessage(`${step.label} 다 넣었어! 👍`);
      const t = setTimeout(onComplete, 700);
      return () => clearTimeout(t);
    }
    setMessage(`촤르르~ ${taps}/${step.taps}`);
  }, [taps, done, step.taps, step.label, onComplete, setMessage]);

  function handle() {
    if (done) return;
    setTaps(p => Math.min(p + 1, step.taps));
    setAnimKey(p => p + 1);
    setStreaming(true);
    setTimeout(() => setStreaming(false), 520);
  }

  const isMilk = step.emoji === "🥛";
  const fillPct = (taps / step.taps) * 68;
  const fillColor = isMilk
    ? "rgba(240, 248, 255, 0.7)"
    : "rgba(255, 248, 210, 0.72)";
  const streamBg = isMilk
    ? "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(210,235,255,0.5))"
    : "linear-gradient(180deg, rgba(255,252,230,0.95), rgba(255,248,215,0.5))";

  return (
    <div className={styles.pourLayout}>
      {/* Ingredient — remount on each tap to replay tilt animation */}
      <div
        key={animKey}
        className={styles.pourIngredient}
        onClick={handle}
        role="button"
      >
        {EMOJI_IMAGES[step.emoji] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={EMOJI_IMAGES[step.emoji]} alt={step.label} className={styles.pourIngredientImg} />
        ) : (
          step.emoji
        )}
      </div>

      {/* Stream between ingredient and bowl */}
      <div className={styles.pourStreamWrap}>
        {streaming && (
          <div
            className={`${styles.pourStream} ${isMilk ? "" : styles.pourStreamFlour}`}
            style={{ background: streamBg }}
          />
        )}
      </div>

      {/* Bowl with rising fill */}
      <div className={`${styles.bowlImageWrap} ${isMilk ? styles.bowlImageWrapMilk : ""}`}>
        <div
          className={styles.pourFill}
          style={{ height: `${fillPct}%`, background: fillColor }}
        />
      </div>
    </div>
  );
}
