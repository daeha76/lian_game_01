export type Appliance = "stove" | "air_fryer";
export type SpreadColor = "pink" | "orange";

export type StepType =
  | "talk"
  | "ingredients"
  | "crack_egg"
  | "whisk"
  | "pour"
  | "knead"
  | "roll"
  | "appliance_in"
  | "appliance_run"
  | "appliance_open"
  | "take_out"
  | "spread"
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
export interface CrackEggStep extends BaseStep { type: "crack_egg"; taps: number; }
export interface WhiskStep extends BaseStep { type: "whisk"; target: number; }
export interface PourStep extends BaseStep {
  type: "pour";
  emoji: string;
  label: string;
  taps: number;
}
export interface KneadStep extends BaseStep { type: "knead"; target: number; }
export interface RollStep extends BaseStep { type: "roll"; target: number; }

export interface ApplianceInStep extends BaseStep {
  type: "appliance_in";
  appliance: Appliance;
}
export interface ApplianceRunStep extends BaseStep {
  type: "appliance_run";
  appliance: Appliance;
  duration: number;
}
export interface ApplianceOpenStep extends BaseStep {
  type: "appliance_open";
  appliance: Appliance;
}

export interface TakeOutStep extends BaseStep { type: "take_out"; }

export interface SpreadStep extends BaseStep {
  type: "spread";
  color: SpreadColor;
  target: number;
}

export interface EatStep extends BaseStep { type: "eat"; bites: number; }
export interface FinaleStep extends BaseStep { type: "finale"; }

export type Step =
  | TalkStep
  | IngredientsStep
  | CrackEggStep
  | WhiskStep
  | PourStep
  | KneadStep
  | RollStep
  | ApplianceInStep
  | ApplianceRunStep
  | ApplianceOpenStep
  | TakeOutStep
  | SpreadStep
  | EatStep
  | FinaleStep;

export interface Recipe {
  id: string;
  name: string;
  finalImage: string;
  /** 안 구운 모양 (반죽 단계 후 가전에 들어가는 음식) */
  rawEmoji: string;
  /** 구운 후 모양 (꺼내기, 먹이기 단계) */
  cookedEmoji: string;
  /** 먹이기 단계에서 빵 위에 입히는 잼/크림 색 (없으면 pink) */
  spreadColor?: SpreadColor;
  steps: Step[];
}

export interface StepProps<S extends Step = Step> {
  step: S;
  onComplete: () => void;
  setMessage: (msg: string) => void;
  recipe: Recipe;
}
