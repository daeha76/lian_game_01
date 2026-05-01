"use client";

import { useState } from "react";
import type { LidOpenStep as LS, StepProps } from "../types";
import styles from "./steps.module.css";

export default function LidOpenStep({ onComplete }: StepProps<LS>) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.stove}>
      <div
        className={`${styles.lid} ${open ? styles.lidOpen : ""}`}
        onClick={() => {
          if (open) return;
          setOpen(true);
          setTimeout(onComplete, 700);
        }}
      />
      <div className={styles.burner}>🥖</div>
    </div>
  );
}
