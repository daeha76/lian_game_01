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
        <div key={animKey} className={styles.eggSvg} style={{ position: "relative", width: 140, height: 170 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/egg.png"
            alt="달걀"
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
          {taps > 0 && (
            <svg
              width="140" height="170"
              viewBox="0 0 120 150"
              style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
            >
              <path
                d={CRACK_PATHS[Math.min(taps, CRACK_PATHS.length - 1)]}
                stroke="#8a6020" strokeWidth="2"
                fill="none" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
