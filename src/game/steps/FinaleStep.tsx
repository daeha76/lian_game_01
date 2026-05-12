"use client";

import { useState } from "react";
import type { FinaleStep as FS, StepProps } from "../types";
import { RollCakeSlice } from "../CookedFood";
import styles from "./steps.module.css";

function Placeholder({ recipe }: { recipe: StepProps<FS>["recipe"] }) {
  if (recipe.category === "rollcake") {
    const color = recipe.spreadColor ?? "pink";
    return (
      <div className={styles.placeholderRollcake}>
        <RollCakeSlice color={color} />
        <RollCakeSlice color={color} />
        <RollCakeSlice color={color} />
      </div>
    );
  }
  return <div className={styles.placeholderCake}>{recipe.cookedEmoji}</div>;
}

export default function FinaleStep({ recipe }: StepProps<FS>) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={styles.finale}>
      {imgError ? (
        <Placeholder recipe={recipe} />
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
