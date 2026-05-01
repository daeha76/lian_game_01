"use client";

import { useEffect, useRef, useState } from "react";
import { useDraggable } from "../useDrag";
import type { EatStep as ES, Recipe, StepProps, SpreadColor } from "../types";
import styles from "./steps.module.css";

const FACES = ["😊", "😋", "🤤", "😄"];
const BITE_MESSAGES = ["냠~ 맛있다!", "냠냠~ 더 줘!", "냠냠냠~ 정말 최고야!"];

const SPREAD_GRADIENT: Record<SpreadColor, string> = {
  pink:   "radial-gradient(ellipse at 30% 30%, #ff5d92 0%, #d6457f 60%, transparent 100%)",
  orange: "radial-gradient(ellipse at 30% 30%, #ffa84d 0%, #e07b1a 60%, transparent 100%)",
  yellow: "radial-gradient(ellipse at 30% 30%, #ffe040 0%, #f0c000 60%, transparent 100%)",
};

/**
 * 잼/생크림 발린 빵/케익을 캐릭터 입에 드래그.
 * step.bites 만큼 베어물면 다음 단계로.
 */
export default function EatStep({ step, recipe, onComplete, setMessage }: StepProps<ES>) {
  const characterRef = useRef<HTMLDivElement>(null);
  const [bites, setBites] = useState(0);
  const [chomping, setChomping] = useState(false);

  const isDone = bites >= step.bites;
  const breadScale = Math.max(0.25, 1 - bites / step.bites);

  useEffect(() => {
    if (bites === 0) return;
    setChomping(true);
    setMessage(BITE_MESSAGES[Math.min(bites - 1, BITE_MESSAGES.length - 1)]);
    const tChomp = setTimeout(() => setChomping(false), 400);
    const tDone = bites >= step.bites ? setTimeout(onComplete, 1300) : null;
    return () => {
      clearTimeout(tChomp);
      if (tDone) clearTimeout(tDone);
    };
  }, [bites, step.bites, onComplete, setMessage]);

  return (
    <div className={styles.eatLayout}>
      {!isDone && (
        <Bread
          key={bites}
          recipe={recipe}
          characterRef={characterRef}
          scale={breadScale}
          onEaten={() => setBites((prev) => prev + 1)}
        />
      )}
      <div ref={characterRef} className={`${styles.character} ${chomping ? styles.chomping : ""}`}>
        <span className={styles.characterFace}>
          {isDone ? "😄" : FACES[Math.min(bites, FACES.length - 1)]}
        </span>
      </div>
    </div>
  );
}

function Bread({
  recipe,
  characterRef,
  scale,
  onEaten,
}: {
  recipe: Recipe;
  characterRef: React.RefObject<HTMLDivElement | null>;
  scale: number;
  onEaten: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const overlayBg = SPREAD_GRADIENT[recipe.spreadColor ?? "pink"];

  useDraggable(ref, () =>
    characterRef.current ? [{ el: characterRef.current, onDrop: onEaten }] : [],
  );

  return (
    <div ref={ref} className={styles.jamBread} style={{ transform: `scale(${scale})` }}>
      <div className={styles.jamBreadInner}>
        {recipe.cookedEmoji}
        <span className={styles.jamOverlay} style={{ background: overlayBg }} />
      </div>
    </div>
  );
}
