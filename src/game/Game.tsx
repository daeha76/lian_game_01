"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Recipe, Step } from "./types";
import { pickRandomRecipe } from "./recipes";
import styles from "./Game.module.css";

import TalkStep from "./steps/TalkStep";
import IngredientsStep from "./steps/IngredientsStep";
import DoughStep from "./steps/DoughStep";
import StoveInStep from "./steps/StoveInStep";
import CookStep from "./steps/CookStep";
import LidOpenStep from "./steps/LidOpenStep";
import TakeOutStep from "./steps/TakeOutStep";
import JamStep from "./steps/JamStep";
import EatStep from "./steps/EatStep";
import FinaleStep from "./steps/FinaleStep";

export default function Game() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [message, setMessage] = useState("오늘은 무엇을 만들까?");

  // Strict Mode에서 state updater가 두 번 실행되는 것을 피하기 위해
  // 현재 상태는 ref로 읽고, setState는 명시적 단일 호출로 진행
  const stateRef = useRef({ recipe, stepIndex });
  useEffect(() => {
    stateRef.current = { recipe, stepIndex };
  });

  const start = useCallback(() => {
    const r = pickRandomRecipe();
    setRecipe(r);
    setStepIndex(0);
    setMessage(r.steps[0].message);
  }, []);

  const goToStart = useCallback(() => {
    setRecipe(null);
    setStepIndex(0);
    setMessage("오늘은 무엇을 만들까?");
  }, []);

  const next = useCallback(() => {
    const { recipe: r, stepIndex: i } = stateRef.current;
    if (!r) return;
    const ni = i + 1;
    if (ni >= r.steps.length) {
      goToStart();
      return;
    }
    setStepIndex(ni);
    setMessage(r.steps[ni].message);
  }, [goToStart]);

  const showStart = !recipe;
  const currentStep: Step | undefined = recipe?.steps[stepIndex];
  const stepBtn = currentStep?.button;
  const percent = recipe ? (stepIndex / recipe.steps.length) * 100 : 0;
  const isLastStep = recipe != null && stepIndex === recipe.steps.length - 1;

  function handleButton() {
    if (showStart) start();
    else if (isLastStep) goToStart();
    else next();
  }

  return (
    <div className={styles.app}>
      <div className={styles.bgDots} />
      <main className={styles.stage}>
        <div className={styles.speech}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.playArea}>
          {currentStep && recipe && (
            <StepRenderer
              step={currentStep}
              recipe={recipe}
              stepIndex={stepIndex}
              onComplete={next}
              setMessage={setMessage}
            />
          )}
        </div>
        {(showStart || stepBtn) && (
          <button className={styles.bigBtn} onClick={handleButton}>
            {showStart ? "시작!" : stepBtn}
          </button>
        )}
      </main>
      <div className={styles.progress}>
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function StepRenderer({
  step,
  recipe,
  stepIndex,
  onComplete,
  setMessage,
}: {
  step: Step;
  recipe: Recipe;
  stepIndex: number;
  onComplete: () => void;
  setMessage: (m: string) => void;
}) {
  // key로 step 위치를 고정 — 같은 type이 연속해도 새 인스턴스로 마운트
  const key = `${recipe.id}-${stepIndex}-${step.type}`;
  const props = { onComplete, setMessage, recipe };

  switch (step.type) {
    case "talk":        return <TalkStep        key={key} step={step} {...props} />;
    case "ingredients": return <IngredientsStep key={key} step={step} {...props} />;
    case "knead":
    case "roll":        return <DoughStep       key={key} step={step} {...props} />;
    case "stove_in":    return <StoveInStep     key={key} step={step} {...props} />;
    case "cook":        return <CookStep        key={key} step={step} {...props} />;
    case "lid_open":    return <LidOpenStep     key={key} step={step} {...props} />;
    case "take_out":    return <TakeOutStep     key={key} step={step} {...props} />;
    case "jam":         return <JamStep         key={key} step={step} {...props} />;
    case "eat":         return <EatStep         key={key} step={step} {...props} />;
    case "finale":      return <FinaleStep      key={key} step={step} {...props} />;
  }
}
