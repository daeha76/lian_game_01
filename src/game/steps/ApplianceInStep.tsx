"use client";

import { useRef, useState, ReactNode } from "react";
import { useDraggable } from "../useDrag";
import { EMOJI_IMAGES } from "../images";
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

  const fruitSrc = EMOJI_IMAGES[recipe.rawEmoji];
  const fruitView: ReactNode = fruitSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={fruitSrc} alt="" className={styles.breadImg} />
  ) : (
    recipe.rawEmoji
  );

  const draggable: ReactNode = isMacaron
    ? <MacaronTray color={color} cooked={false} size={26} />
    : fruitView;
  const insideView: ReactNode = inside
    ? (isMacaron ? <MacaronTray color={color} cooked={false} size={20} /> : fruitView)
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/blender.png" alt="믹서기" className={styles.blenderImg} />
          <div className={styles.blenderContent}>{insideView}</div>
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
