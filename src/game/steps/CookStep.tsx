"use client";

import { useEffect } from "react";
import type { CookStep as CS, StepProps } from "../types";
import styles from "./steps.module.css";

export default function CookStep({ step, onComplete, setMessage }: StepProps<CS>) {
  useEffect(() => {
    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      setMessage("맛있게 구워지는 중" + ".".repeat(dots) + " 🔥");
    }, 400);
    const timer = setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, step.duration);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${styles.stove} ${styles.stoveOn}`}>
      <div className={styles.burner}>🍞</div>
    </div>
  );
}
