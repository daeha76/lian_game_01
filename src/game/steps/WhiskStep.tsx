"use client";

import { useEffect, useRef, useState } from "react";
import type { WhiskStep as WS, StepProps } from "../types";
import styles from "./steps.module.css";

// ~1 unit ≈ one full circular stroke around the bowl (radius ~65px → circ ~410px)
const MOVE_PER_UNIT = 400;

// Fixed bubble positions relative to bowl center (127, 127)
const BUBBLE_SPOTS = [
  { x: -28, y: -38, r: 5 }, { x: 38, y: -48, r: 6 }, { x: 58, y: -8, r: 4 },
  { x: 48, y: 38, r: 7 },   { x: -12, y: 55, r: 5 }, { x: -55, y: 12, r: 6 },
  { x: -42, y: -35, r: 4 }, { x: 12,  y: 18, r: 8 }, { x: 58,  y: 55, r: 5 },
  { x: -28, y: 62, r: 6 },  { x: 32,  y: -18, r: 4 }, { x: -48, y: 42, r: 5 },
];

export default function WhiskStep({ step, onComplete, setMessage }: StepProps<WS>) {
  const bowlRef = useRef<HTMLDivElement>(null);
  const [whiskPos, setWhiskPos] = useState({ x: 127, y: 127 });
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);
  const accRef = useRef(0);

  useEffect(() => {
    if (progress === 0) return;
    if (progress >= step.target && !doneRef.current) {
      doneRef.current = true;
      setMessage("잘 섞였어요! 😄");
      const t = setTimeout(onComplete, 700);
      return () => clearTimeout(t);
    }
    const msgs = ["한 바퀴! 잘하고 있어~ 🌀", "두 바퀴! 조금만 더~!", "한 바퀴만 더!"];
    setMessage(msgs[Math.min(progress - 1, msgs.length - 1)]);
  }, [progress, step.target, onComplete, setMessage]);

  useEffect(() => {
    const bowl = bowlRef.current;
    if (!bowl) return;

    let down = false;
    let lastX = 0, lastY = 0;

    function onDown(e: PointerEvent) {
      e.preventDefault();
      down = true;
      lastX = e.clientX; lastY = e.clientY;
      try { bowl!.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    }
    function onMove(e: PointerEvent) {
      if (!down || doneRef.current) return;
      const rect = bowl!.getBoundingClientRect();
      setWhiskPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      accRef.current += dist;
      const gained = Math.floor(accRef.current / MOVE_PER_UNIT);
      if (gained > 0) {
        accRef.current -= gained * MOVE_PER_UNIT;
        setProgress(p => doneRef.current ? p : Math.min(p + gained, step.target));
      }
      lastX = e.clientX; lastY = e.clientY;
    }
    function onUp() { down = false; }

    bowl.addEventListener("pointerdown", onDown);
    bowl.addEventListener("pointermove", onMove);
    bowl.addEventListener("pointerup", onUp);
    bowl.addEventListener("pointercancel", onUp);
    return () => {
      bowl.removeEventListener("pointerdown", onDown);
      bowl.removeEventListener("pointermove", onMove);
      bowl.removeEventListener("pointerup", onUp);
      bowl.removeEventListener("pointercancel", onUp);
    };
  }, [step.target]);

  const ratio = Math.min(progress / step.target, 1);
  const numBubbles = Math.floor(ratio * BUBBLE_SPOTS.length);

  return (
    <div className={styles.whiskLayout}>
      <div ref={bowlRef} className={styles.whiskBowl}>
        {/* 진행도에 맞춰 거품만 작게 표시 — 볼 이미지는 가리지 않음 */}
        {BUBBLE_SPOTS.slice(0, numBubbles).map((b, i) => (
          <div
            key={i}
            className={styles.bubble}
            style={{
              left: 127 + b.x - b.r,
              top:  127 + b.y - b.r,
              width:  b.r * 2,
              height: b.r * 2,
            }}
          />
        ))}
        {/* Whisk follows pointer */}
        <div
          className={styles.whiskFollower}
          style={{ left: whiskPos.x, top: whiskPos.y }}
        >
          <WhiskIcon />
        </div>
      </div>
    </div>
  );
}

function WhiskIcon() {
  return (
    <svg width="48" height="84" viewBox="0 0 48 84">
      <rect x="19" y="0" width="10" height="36" rx="5" fill="#9B7820" />
      <line x1="24" y1="36" x2="24" y2="44" stroke="#c0c0c0" strokeWidth="3" />
      <ellipse cx="24" cy="65" rx="19" ry="17" fill="none" stroke="#c8c8c8" strokeWidth="2.5" />
      <ellipse cx="24" cy="65" rx="13" ry="12" fill="none" stroke="#b8b8b8" strokeWidth="2" />
      <ellipse cx="24" cy="65" rx="7"  ry="7"  fill="none" stroke="#a8a8a8" strokeWidth="1.5" />
      <line x1="5"  y1="58" x2="43" y2="72" stroke="#b0b0b0" strokeWidth="1.5" />
      <line x1="43" y1="58" x2="5"  y2="72" stroke="#b0b0b0" strokeWidth="1.5" />
    </svg>
  );
}
