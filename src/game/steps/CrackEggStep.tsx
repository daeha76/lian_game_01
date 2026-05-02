"use client";

import { useState, useEffect } from "react";
import type { CrackEggStep as CES, StepProps } from "../types";
import styles from "./steps.module.css";

// Progressive crack SVG paths, one per tap stage
const CRACK_PATHS = [
  "",
  "M62,42 l-8,18 M72,40 l6,14",
  "M62,42 l-10,22 M72,40 l8,18 M55,52 l-8,6",
  "M62,42 l-12,26 M72,40 l10,22 M53,50 l-12,8 M73,58 l10,12",
];

export default function CrackEggStep({ step, onComplete, setMessage }: StepProps<CES>) {
  const [taps, setTaps] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const done = taps >= step.taps;

  useEffect(() => {
    if (taps === 0) return;
    if (done) {
      setMessage("달걀이 깨졌어요! 🍳");
      return;
    }
    setMessage(`탁탁! ${taps}/${step.taps}`);
  }, [taps, done, step.taps, setMessage]);

  function handle() {
    if (done) return;
    setTaps(p => Math.min(p + 1, step.taps));
    setAnimKey(p => p + 1);
  }

  return (
    <div className={styles.eggArea} onClick={handle}>
      {done ? (
        <video
          className={styles.eggVideo}
          src="/assets/egg-break.mp4"
          autoPlay
          muted
          playsInline
          onEnded={onComplete}
          onError={onComplete}
        />
      ) : (
        <svg
          key={animKey}
          className={styles.eggSvg}
          width="140" height="170"
          viewBox="0 0 120 150"
        >
          <ellipse cx="60" cy="88" rx="44" ry="54" fill="#FFF5D0" stroke="#d4b060" strokeWidth="2.5" />
          <ellipse cx="46" cy="68" rx="9" ry="12" fill="rgba(255,255,255,0.55)" />
          {taps > 0 && (
            <path
              d={CRACK_PATHS[Math.min(taps, CRACK_PATHS.length - 1)]}
              stroke="#8a6020" strokeWidth="2"
              fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
          )}
        </svg>
      )}
    </div>
  );
}
