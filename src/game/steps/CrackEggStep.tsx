"use client";

import { useState, useEffect } from "react";
import type { CrackEggStep as CES, StepProps } from "../types";
import styles from "./steps.module.css";

const CRACK_PATHS = [
  "",
  "M62,42 l-8,18 M72,40 l6,14",
  "M62,42 l-10,22 M72,40 l8,18 M55,52 l-8,6",
  "M62,42 l-12,26 M72,40 l10,22 M53,50 l-12,8 M73,58 l10,12",
];

const CHICK_CHANCE = 0.2;

type Outcome = "egg" | "chick";

export default function CrackEggStep({ step, onComplete, setMessage }: StepProps<CES>) {
  const [taps, setTaps] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const targetReached = taps >= step.taps;

  useEffect(() => {
    if (targetReached && outcome === null) {
      setOutcome(Math.random() < CHICK_CHANCE ? "chick" : "egg");
    }
  }, [targetReached, outcome]);

  useEffect(() => {
    if (outcome === "chick") {
      setMessage("앗! 병아리가 나왔어요 😢 다시 해볼까?");
      return;
    }
    if (outcome === "egg") {
      setMessage("달걀이 깨졌어요! 🍳");
      return;
    }
    if (taps === 0) return;
    setMessage(`탁탁! ${taps}/${step.taps}`);
  }, [taps, outcome, step.taps, setMessage]);

  function handleTap() {
    if (targetReached) return;
    setTaps(p => Math.min(p + 1, step.taps));
    setAnimKey(p => p + 1);
  }

  function retry() {
    setTaps(0);
    setOutcome(null);
    setAnimKey(p => p + 1);
  }

  if (outcome === "chick") {
    return (
      <div className={styles.eggArea}>
        <video
          className={styles.eggVideo}
          src="/assets/chick-hatch.mp4"
          autoPlay
          muted
          playsInline
        />
        <button className={styles.retryBtn} onClick={retry}>
          다시 하기 🥚
        </button>
      </div>
    );
  }

  if (outcome === "egg") {
    return (
      <div className={styles.eggArea}>
        <video
          className={styles.eggVideo}
          src="/assets/egg-break.mp4"
          autoPlay
          muted
          playsInline
          onEnded={onComplete}
          onError={onComplete}
        />
      </div>
    );
  }

  return (
    <div className={styles.eggArea} onClick={handleTap}>
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
    </div>
  );
}
