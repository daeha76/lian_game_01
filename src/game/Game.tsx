"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Recipe, Step } from "./types";
import { RECIPES } from "./recipes";
import styles from "./Game.module.css";

import TalkStep from "./steps/TalkStep";
import IngredientsStep from "./steps/IngredientsStep";
import DoughStep from "./steps/DoughStep";
import ApplianceInStep from "./steps/ApplianceInStep";
import ApplianceRunStep from "./steps/ApplianceRunStep";
import ApplianceOpenStep from "./steps/ApplianceOpenStep";
import TakeOutStep from "./steps/TakeOutStep";
import SpreadStep from "./steps/SpreadStep";
import EatStep from "./steps/EatStep";
import FinaleStep from "./steps/FinaleStep";

export default function Game() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [message, setMessage] = useState("오늘은 무엇을 만들까?");

  const stateRef = useRef({ recipe, stepIndex });
  useEffect(() => {
    stateRef.current = { recipe, stepIndex };
  });

  const start = useCallback((r: Recipe) => {
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
    if (isLastStep) goToStart();
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
          {showStart ? (
            <RecipeMenu onPick={start} />
          ) : currentStep && recipe ? (
            <StepRenderer
              step={currentStep}
              recipe={recipe}
              stepIndex={stepIndex}
              onComplete={next}
              setMessage={setMessage}
            />
          ) : null}
        </div>
        {!showStart && stepBtn && (
          <button className={styles.bigBtn} onClick={handleButton}>
            {stepBtn}
          </button>
        )}
      </main>
      <div className={styles.progress}>
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function RecipeMenu({ onPick }: { onPick: (r: Recipe) => void }) {
  return (
    <div className={styles.recipeMenu}>
      {RECIPES.map((r) => (
        <button
          key={r.id}
          className={`${styles.recipeCard} ${styles[`card_${r.spreadColor ?? "pink"}`]}`}
          onClick={() => onPick(r)}
        >
          <span className={styles.cardEmoji}>{r.cookedEmoji}</span>
          <span className={styles.cardName}>{r.name}</span>
        </button>
      ))}
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
  const key = `${recipe.id}-${stepIndex}-${step.type}`;
  const props = { onComplete, setMessage, recipe };

  switch (step.type) {
    case "talk":             return <TalkStep             key={key} step={step} {...props} />;
    case "ingredients":      return <IngredientsStep      key={key} step={step} {...props} />;
    case "knead":
    case "roll":             return <DoughStep            key={key} step={step} {...props} />;
    case "appliance_in":     return <ApplianceInStep      key={key} step={step} {...props} />;
    case "appliance_run":    return <ApplianceRunStep     key={key} step={step} {...props} />;
    case "appliance_open":   return <ApplianceOpenStep    key={key} step={step} {...props} />;
    case "take_out":         return <TakeOutStep          key={key} step={step} {...props} />;
    case "spread":           return <SpreadStep           key={key} step={step} {...props} />;
    case "eat":              return <EatStep              key={key} step={step} {...props} />;
    case "finale":           return <FinaleStep           key={key} step={step} {...props} />;
  }
}
