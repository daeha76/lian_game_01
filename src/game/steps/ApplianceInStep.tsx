"use client";

import { useRef, useState } from "react";
import { useDraggable } from "../useDrag";
import type { ApplianceInStep as AIS, StepProps } from "../types";
import styles from "./steps.module.css";

/** 안 구운 빵/케익을 가스레인지 또는 에어프라이기에 드래그 */
export default function ApplianceInStep({ step, recipe, onComplete }: StepProps<AIS>) {
  const breadRef = useRef<HTMLDivElement>(null);
  const applianceRef = useRef<HTMLDivElement>(null);
  const [inside, setInside] = useState(false);
  const [consumed, setConsumed] = useState(false);

  useDraggable(
    breadRef,
    () =>
      applianceRef.current
        ? [
            {
              el: applianceRef.current,
              onDrop: () => {
                setConsumed(true);
                setInside(true);
                setTimeout(onComplete, 500);
              },
            },
          ]
        : [],
    !consumed,
  );

  const isAirFryer = step.appliance === "air_fryer";

  return (
    <div className={styles.stoveLayout}>
      <div ref={breadRef} className={`${styles.bread} ${consumed ? styles.consumed : ""}`}>
        {recipe.rawEmoji}
      </div>
      {isAirFryer ? (
        <div ref={applianceRef} className={styles.airFryer}>
          <div className={styles.airFryerWindow}>{inside ? recipe.rawEmoji : ""}</div>
        </div>
      ) : (
        <div ref={applianceRef} className={styles.stove}>
          <div className={styles.burner}>{inside ? recipe.rawEmoji : ""}</div>
        </div>
      )}
    </div>
  );
}
