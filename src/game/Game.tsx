"use client";

import { useState, useCallback, useRef, useEffect, CSSProperties } from "react";
import { Recipe, Step, SpreadColor, RecipeCategory } from "./types";
import { RECIPES } from "./recipes";
import styles from "./Game.module.css";

const THEMES: Record<SpreadColor, { dots: string; light: string; main: string; grad: string; dark: string }> = {
  pink:   { dots: "#ffd1e0", light: "#ffb3cc", main: "#ff5d92", grad: "#ff8eb5", dark: "#d6457f" },
  orange: { dots: "#ffe0b2", light: "#ffc880", main: "#ff8a3d", grad: "#ffb060", dark: "#c25a18" },
  yellow: { dots: "#fff3a0", light: "#ffe566", main: "#f5b800", grad: "#ffdb50", dark: "#c08800" },
  green:  { dots: "#c8f5c0", light: "#a0e87a", main: "#3db840", grad: "#85d860", dark: "#267a20" },
  blue:   { dots: "#b0c8ff", light: "#80aaff", main: "#4466ee", grad: "#6688ff", dark: "#2233bb" },
  indigo: { dots: "#c0b8f0", light: "#8877dd", main: "#5544bb", grad: "#7766cc", dark: "#332299" },
  purple: { dots: "#e0b8f8", light: "#cc88ee", main: "#9933cc", grad: "#bb66dd", dark: "#7722aa" },
  blush:  { dots: "#ffeaf3", light: "#ffccdd", main: "#ffaacc", grad: "#ffc4d8", dark: "#dd6688" },
};

const CATEGORIES: { key: RecipeCategory; label: string; emoji: string }[] = [
  { key: "cake",     label: "케잌",       emoji: "🍰" },
  { key: "milk",     label: "우유",       emoji: "🥤" },
  { key: "icecream", label: "아이스크림", emoji: "🍦" },
  { key: "candy",    label: "사탕",       emoji: "🍬" },
  { key: "macaron",  label: "마카롱",     emoji: "🎀" },
];

import TalkStep from "./steps/TalkStep";
import IngredientsStep from "./steps/IngredientsStep";
import CrackEggStep from "./steps/CrackEggStep";
import WhiskStep from "./steps/WhiskStep";
import PourStep from "./steps/PourStep";
import DoughStep from "./steps/DoughStep";
import PrepStep from "./steps/PrepStep";
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
  const [category, setCategory] = useState<RecipeCategory>("cake");

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

  const theme = THEMES[recipe?.spreadColor ?? "pink"];
  const themeVars = {
    "--theme-dots":  theme.dots,
    "--theme-light": theme.light,
    "--theme-main":  theme.main,
    "--theme-grad":  theme.grad,
    "--theme-dark":  theme.dark,
  } as CSSProperties;

  return (
    <div className={styles.app} style={themeVars}>
      <div className={styles.bgDots} />
      <main className={styles.stage}>
        <div className={styles.speech}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.playArea}>
          {showStart ? (
            <RecipeMenu category={category} onChangeCategory={setCategory} onPick={start} />
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

function RecipeMenu({
  category,
  onChangeCategory,
  onPick,
}: {
  category: RecipeCategory;
  onChangeCategory: (c: RecipeCategory) => void;
  onPick: (r: Recipe) => void;
}) {
  const filtered = RECIPES.filter((r) => r.category === category);

  return (
    <div className={styles.recipeMenuWrap}>
      <div className={styles.categoryTabs}>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`${styles.categoryTab} ${c.key === category ? styles.categoryTabActive : ""}`}
            onClick={() => onChangeCategory(c.key)}
          >
            <span className={styles.categoryTabEmoji}>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
      <div className={styles.recipeMenu}>
        {filtered.map((r) => (
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
    case "crack_egg":        return <CrackEggStep         key={key} step={step} {...props} />;
    case "whisk":            return <WhiskStep            key={key} step={step} {...props} />;
    case "pour":             return <PourStep             key={key} step={step} {...props} />;
    case "knead":
    case "roll":             return <DoughStep            key={key} step={step} {...props} />;
    case "prep":             return <PrepStep             key={key} step={step} {...props} />;
    case "appliance_in":     return <ApplianceInStep      key={key} step={step} {...props} />;
    case "appliance_run":    return <ApplianceRunStep     key={key} step={step} {...props} />;
    case "appliance_open":   return <ApplianceOpenStep    key={key} step={step} {...props} />;
    case "take_out":         return <TakeOutStep          key={key} step={step} {...props} />;
    case "spread":           return <SpreadStep           key={key} step={step} {...props} />;
    case "eat":              return <EatStep              key={key} step={step} {...props} />;
    case "finale":           return <FinaleStep           key={key} step={step} {...props} />;
  }
}
