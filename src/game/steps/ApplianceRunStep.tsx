"use client";

import { useEffect, useState, ReactNode } from "react";
import type { ApplianceRunStep as ARS, StepProps } from "../types";
import CookedFood, { MacaronTray } from "../CookedFood";
import { EMOJI_IMAGES } from "../images";
import styles from "./steps.module.css";

/** 가스레인지/에어프라이기로 굽는 중 / 믹서기로 가는 중 */
export default function ApplianceRunStep({ step, recipe, onComplete, setMessage }: StepProps<ARS>) {
  const [cooked, setCooked] = useState(false);
  const isAirFryer = step.appliance === "air_fryer";
  const isBlender  = step.appliance === "blender";
  const isFreezer  = step.appliance === "freezer";

  useEffect(() => {
    let dots = 0;
    const verb = isFreezer
      ? "꽁꽁 얼리는 중"
      : isBlender
        ? "위잉~ 가는 중"
        : isAirFryer
          ? "에어프라이기로 굽는 중"
          : "맛있게 구워지는 중";
    const fx = isFreezer ? "❄️" : isBlender ? "🌀" : isAirFryer ? "💨" : "🔥";
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      setMessage(verb + ".".repeat(dots) + " " + fx);
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

  const isMacaron = recipe.category === "macaron";
  const color = recipe.spreadColor ?? "pink";
  const fruitSrc = EMOJI_IMAGES[recipe.rawEmoji];
  const rawFruit: ReactNode = fruitSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={fruitSrc} alt="" />
  ) : (
    recipe.rawEmoji
  );
  const food: ReactNode = isMacaron
    ? <MacaronTray color={color} cooked={cooked} size={20} />
    : (cooked ? <CookedFood recipe={recipe} /> : rawFruit);

  if (isBlender) {
    return (
      <div className={`${styles.blender} ${styles.blenderOn}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/blender.png" alt="믹서기" className={styles.blenderImg} />
        <div className={styles.blenderContent}>{food}</div>
      </div>
    );
  }

  if (isFreezer) {
    return (
      <div className={`${styles.freezer} ${styles.freezerOn}`}>
        <div className={styles.freezerInside}>{food}</div>
        <div className={styles.freezerHandle} />
        <div className={styles.freezerSnow}>❄️ ❄️ ❄️</div>
      </div>
    );
  }

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
