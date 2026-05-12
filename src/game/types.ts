export type Appliance = "stove" | "air_fryer" | "blender" | "freezer" | "oven";
export type SpreadColor = "pink" | "orange" | "yellow" | "green" | "blue" | "indigo" | "purple" | "blush";
export type RecipeCategory = "cake" | "milk" | "icecream" | "candy" | "macaron" | "jelly" | "rollcake";
export type PrepKind = "wash" | "trim" | "chop";

export type StepType =
  | "talk"
  | "ingredients"
  | "crack_egg"
  | "whisk"
  | "pour"
  | "knead"
  | "roll"
  | "roll_up"
  | "prep"
  | "pipe"
  | "appliance_in"
  | "appliance_run"
  | "appliance_open"
  | "take_out"
  | "spread"
  | "slice"
  | "macaron_sandwich"
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

/** 돌돌 말기: 시트 빵을 N번 굴려서 롤케익으로 만들기 */
export interface RollUpStep extends BaseStep { type: "roll_up"; target: number; }

/** 씻기 / 손질 / 잘게 자르기 — 과일을 N번 탭 */
export interface PrepStep extends BaseStep {
  type: "prep";
  kind: PrepKind;
  emoji: string;
  target: number;
}

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

/** 짜기: 쟁반/틀에 반죽을 N개 짜기 (마카롱은 동그라미, 하리보 젤리는 곰모양) */
export interface PipeStep extends BaseStep {
  type: "pipe";
  count: number;
  /** 짜는 모양 — 기본은 동그라미(마카롱), "bear"는 곰모양 틀(하리보 젤리) */
  shape?: "circle" | "bear";
}

/** 마카롱 샌드: 6개 껍질에 크림 발라 짝지어 3개 만들기 */
export interface MacaronSandwichStep extends BaseStep {
  type: "macaron_sandwich";
  pairs: number;
  color: SpreadColor;
}

export interface SpreadStep extends BaseStep {
  type: "spread";
  color: SpreadColor;
  target: number;
}

/** 자르기: 롤케익을 N번 잘라 N+1조각으로 만들기 */
export interface SliceStep extends BaseStep {
  type: "slice";
  /** 자르는 횟수 (조각 수 = target + 1) */
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
  | RollUpStep
  | PrepStep
  | PipeStep
  | ApplianceInStep
  | ApplianceRunStep
  | ApplianceOpenStep
  | TakeOutStep
  | SpreadStep
  | SliceStep
  | MacaronSandwichStep
  | EatStep
  | FinaleStep;

export interface Recipe {
  id: string;
  name: string;
  category: RecipeCategory;
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
