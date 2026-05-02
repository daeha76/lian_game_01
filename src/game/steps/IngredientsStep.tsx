"use client";

import { useRef, useState } from "react";
import { useDraggable } from "../useDrag";
import { EMOJI_IMAGES } from "../images";
import type { IngredientsStep as IS, StepProps } from "../types";
import styles from "./steps.module.css";

export default function IngredientsStep({ step, onComplete, setMessage }: StepProps<IS>) {
  const bowlRef = useRef<HTMLDivElement>(null);
  const [bowlContent, setBowlContent] = useState<string[]>([]);
  const droppedRef = useRef(0);
  const total = step.items.length;

  function handleDropped(emoji: string) {
    setBowlContent((prev) => [...prev, emoji]);
    droppedRef.current += 1;
    if (droppedRef.current < total) {
      setMessage(`좋아! ${droppedRef.current}/${total} 담았어`);
    } else {
      setMessage("재료 다 모았다! 짝짝! 👏");
      setTimeout(onComplete, 1000);
    }
  }

  return (
    <div className={styles.ingredientsLayout}>
      <div className={styles.itemsRow}>
        {step.items.map((item, idx) => (
          <Ingredient
            key={idx}
            emoji={item.emoji}
            label={item.label}
            bowlRef={bowlRef}
            onDropped={() => handleDropped(item.emoji)}
          />
        ))}
      </div>
      <div ref={bowlRef} className={styles.bowlImageWrap}>
        <div className={styles.bowlContent}>
          {bowlContent.map((emoji, i) =>
            EMOJI_IMAGES[emoji] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={EMOJI_IMAGES[emoji]} alt="" className={styles.bowlContentImg} />
            ) : (
              <span key={i}>{emoji}</span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function Ingredient({
  emoji,
  label,
  bowlRef,
  onDropped,
}: {
  emoji: string;
  label: string;
  bowlRef: React.RefObject<HTMLDivElement | null>;
  onDropped: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [consumed, setConsumed] = useState(false);
  const imgSrc = EMOJI_IMAGES[emoji];

  useDraggable(
    ref,
    () =>
      bowlRef.current
        ? [
            {
              el: bowlRef.current,
              onDrop: () => {
                setConsumed(true);
                onDropped();
              },
            },
          ]
        : [],
    !consumed,
  );

  return (
    <div ref={ref} className={`${styles.ingredient} ${consumed ? styles.consumed : ""}`}>
      {imgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imgSrc} alt={label} className={styles.ingredientImg} />
      ) : (
        <span>{emoji}</span>
      )}
      <span className={styles.label}>{label}</span>
    </div>
  );
}
