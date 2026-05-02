"use client";

import { useState, ReactNode } from "react";
import type { StepProps, TakeOutStep as TS } from "../types";
import CookedFood, { MacaronTray } from "../CookedFood";
import styles from "./steps.module.css";

export default function TakeOutStep({ recipe, onComplete }: StepProps<TS>) {
  const [taking, setTaking] = useState(false);
  const isMacaron = recipe.category === "macaron";

  const content: ReactNode = isMacaron
    ? <MacaronTray color={recipe.spreadColor ?? "pink"} cooked={true} size={36} />
    : <CookedFood recipe={recipe} />;

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
      {content}
    </div>
  );
}
