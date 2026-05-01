"use client";

import { useEffect, useState } from "react";
import type { ApplianceRunStep as ARS, StepProps } from "../types";
import styles from "./steps.module.css";

/** 가스레인지/에어프라이기로 굽는 중 */
export default function ApplianceRunStep({ step, recipe, onComplete, setMessage }: StepProps<ARS>) {
  const [cooked, setCooked] = useState(false);
  const isAirFryer = step.appliance === "air_fryer";

  useEffect(() => {
    let dots = 0;
    const verb = isAirFryer ? "에어프라이기로 굽는 중" : "맛있게 구워지는 중";
    const fire = isAirFryer ? "💨" : "🔥";
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      setMessage(verb + ".".repeat(dots) + " " + fire);
    }, 400);
    const timer = setTimeout(() => {
      clearInterval(interval);
      setCooked(true);
      setTimeout(onComplete, 350);
    }, step.duration);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const food = cooked ? recipe.cookedEmoji : recipe.rawEmoji;

  return isAirFryer ? (
    <div className={`${styles.airFryer} ${styles.airFryerOn}`}>
      <div className={styles.airFryerWindow}>{food}</div>
    </div>
  ) : (
    <div className={`${styles.stove} ${styles.stoveOn}`}>
      <div className={styles.burner}>{food}</div>
    </div>
  );
}
