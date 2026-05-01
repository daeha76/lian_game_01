export type StepType =
  | "talk"
  | "ingredients"
  | "knead"
  | "roll"
  | "stove_in"
  | "cook"
  | "lid_open"
  | "take_out"
  | "jam"
  | "eat"
  | "finale";

interface BaseStep {
  type: StepType;
  message: string;
  /** 표시할 액션 버튼 텍스트. 없으면 자동 진행. */
  button?: string;
}

export interface TalkStep extends BaseStep { type: "talk"; }
export interface IngredientsStep extends BaseStep {
  type: "ingredients";
  items: { emoji: string; label: string }[];
}
export interface KneadStep extends BaseStep { type: "knead"; target: number; }
export interface RollStep extends BaseStep { type: "roll"; target: number; }
export interface StoveInStep extends BaseStep { type: "stove_in"; }
export interface CookStep extends BaseStep { type: "cook"; duration: number; }
export interface LidOpenStep extends BaseStep { type: "lid_open"; }
export interface TakeOutStep extends BaseStep { type: "take_out"; }
export interface JamStep extends BaseStep { type: "jam"; target: number; }
export interface EatStep extends BaseStep { type: "eat"; bites: number; }
export interface FinaleStep extends BaseStep { type: "finale"; }

export type Step =
  | TalkStep
  | IngredientsStep
  | KneadStep
  | RollStep
  | StoveInStep
  | CookStep
  | LidOpenStep
  | TakeOutStep
  | JamStep
  | EatStep
  | FinaleStep;

export interface Recipe {
  id: string;
  name: string;
  finalImage: string;
  steps: Step[];
}

export interface StepProps<S extends Step = Step> {
  step: S;
  onComplete: () => void;
  setMessage: (msg: string) => void;
  recipe: Recipe;
}
