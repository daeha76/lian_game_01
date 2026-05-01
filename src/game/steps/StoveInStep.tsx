"use client";

import { useRef, useState } from "react";
import { useDraggable } from "../useDrag";
import type { StepProps, StoveInStep as SIS } from "../types";
import styles from "./steps.module.css";

export default function StoveInStep({ onComplete }: StepProps<SIS>) {
  const breadRef = useRef<HTMLDivElement>(null);
  const stoveRef = useRef<HTMLDivElement>(null);
  const [inStove, setInStove] = useState(false);
  const [consumed, setConsumed] = useState(false);

  useDraggable(
    breadRef,
    () =>
      stoveRef.current
        ? [
            {
              el: stoveRef.current,
              onDrop: () => {
                setConsumed(true);
                setInStove(true);
                setTimeout(onComplete, 500);
              },
            },
          ]
        : [],
    !consumed,
  );

  return (
    <div className={styles.stoveLayout}>
      <div ref={breadRef} className={`${styles.bread} ${consumed ? styles.consumed : ""}`}>
        🍞
      </div>
      <div ref={stoveRef} className={styles.stove}>
        <div className={styles.burner}>{inStove ? "🍞" : ""}</div>
      </div>
    </div>
  );
}
