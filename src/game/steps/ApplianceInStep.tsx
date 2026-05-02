"use client";

import { useRef, useState, ReactNode } from "react";
import { useDraggable } from "../useDrag";
import type { ApplianceInStep as AIS, StepProps } from "../types";
import { MacaronTray } from "../CookedFood";
import styles from "./steps.module.css";

/** 안 구운 빵/케잌/과일을 가스레인지/에어프라이기/믹서기에 드래그 */
export default function ApplianceInStep({ step, recipe, onComplete }: StepProps<AIS>) {
  const breadRef = useRef<HTMLDivElement>(null);
  const applianceRef = useRef<HTMLDivElement>(null);
  const [inside, setInside] = useState(false);
  const [consumed, setConsumed] = useState(false);

  const isMacaron = recipe.category === "macaron";
  const color = recipe.spreadColor ?? "pink";

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

  const draggable: ReactNode = isMacaron
    ? <MacaronTray color={color} cooked={false} size={26} />
    : recipe.rawEmoji;
  const insideView: ReactNode = inside
    ? (isMacaron ? <MacaronTray color={color} cooked={false} size={20} /> : recipe.rawEmoji)
    : "";

  return (
    <div className={styles.stoveLayout}>
      <div ref={breadRef} className={`${styles.bread} ${consumed ? styles.consumed : ""}`}>
        {draggable}
      </div>
      {step.appliance === "air_fryer" ? (
        <div ref={applianceRef} className={styles.airFryer}>
          <div className={styles.airFryerWindow}>{insideView}</div>
        </div>
      ) : step.appliance === "blender" ? (
        <div ref={applianceRef} className={styles.blender}>
          <div className={styles.blenderJar}>
            <div className={styles.blenderContent}>{insideView}</div>
          </div>
          <div className={styles.blenderBase} />
        </div>
      ) : step.appliance === "freezer" ? (
        <div ref={applianceRef} className={styles.freezer}>
          <div className={styles.freezerInside}>{insideView}</div>
          <div className={styles.freezerHandle} />
        </div>
      ) : (
        <div ref={applianceRef} className={styles.stove}>
          <div className={styles.burner}>{insideView}</div>
        </div>
      )}
    </div>
  );
}
