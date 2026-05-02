"use client";

import { useState } from "react";
import type { StepProps, TakeOutStep as TS } from "../types";
import CookedFood from "../CookedFood";
import styles from "./steps.module.css";

export default function TakeOutStep({ recipe, onComplete }: StepProps<TS>) {
  const [taking, setTaking] = useState(false);

  return (
    <div
      className={styles.bread}
      style={taking ? { transform: "translateY(-100px) scale(1.4)", transition: "all 0.5s" } : undefined}
      onClick={() => {
        if (taking) return;
        setTaking(true);
        setTimeout(onComplete, 500);
      }}
    >
      <CookedFood recipe={recipe} />
    </div>
  );
}
