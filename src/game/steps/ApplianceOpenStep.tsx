"use client";

import { useState } from "react";
import type { ApplianceOpenStep as AOS, StepProps } from "../types";
import CookedFood from "../CookedFood";
import styles from "./steps.module.css";

/** 가스레인지 뚜껑 / 에어프라이기 도어 열기 */
export default function ApplianceOpenStep({ step, recipe, onComplete }: StepProps<AOS>) {
  const [open, setOpen] = useState(false);
  const isAirFryer = step.appliance === "air_fryer";

  function handleClick() {
    if (open) return;
    setOpen(true);
    setTimeout(onComplete, 700);
  }

  if (isAirFryer) {
    return (
      <div className={styles.airFryer}>
        <div
          className={`${styles.airFryerDoor} ${open ? styles.airFryerDoorOpen : ""}`}
          onClick={handleClick}
        />
        <div className={styles.airFryerWindow}>
          <CookedFood recipe={recipe} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stove}>
      <div className={`${styles.lid} ${open ? styles.lidOpen : ""}`} onClick={handleClick} />
      <div className={styles.burner}>
        <CookedFood recipe={recipe} />
      </div>
    </div>
  );
}
