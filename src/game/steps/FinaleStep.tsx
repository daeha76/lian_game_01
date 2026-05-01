"use client";

import { useState } from "react";
import type { FinaleStep as FS, StepProps } from "../types";
import styles from "./steps.module.css";

export default function FinaleStep({ recipe }: StepProps<FS>) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={styles.finale}>
      {imgError ? (
        <div className={styles.placeholderCake}>🍰</div>
      ) : (
        // 사용자 그림 placeholder — 없으면 onError로 fallback
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipe.finalImage}
          alt={recipe.name}
          onError={() => setImgError(true)}
        />
      )}
      <div className={styles.sparkles}>✨ 🌟 ✨</div>
    </div>
  );
}
