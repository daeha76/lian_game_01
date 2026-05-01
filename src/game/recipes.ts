import { Recipe } from "./types";

/** 새 레시피는 이 배열에 한 덩어리만 추가하면 됨 */
export const RECIPES: Recipe[] = [
  {
    id: "strawberry_bread",
    name: "딸기 빵",
    finalImage: "/assets/strawberry-bread.png",
    rawEmoji: "🍞",
    cookedEmoji: "🥖",
    spreadColor: "pink",
    steps: [
      { type: "talk", message: "오늘은 핑크색 음식을 만들어 볼까? 🎀", button: "알았어!" },
      {
        type: "ingredients",
        message: "재료를 볼에 담아봐! 끌어다 놓으면 돼",
        items: [
          { emoji: "🌾", label: "밀가루" },
          { emoji: "🥛", label: "우유" },
          { emoji: "🍓", label: "딸기" },
          { emoji: "🥚", label: "달걀" },
        ],
      },
      { type: "knead", message: "반죽을 조물조물! 5번 눌러봐", target: 5 },
      { type: "roll",  message: "이번엔 반죽을 밀어볼까? 5번 더!", target: 5 },
      { type: "appliance_in",   message: "빵을 가스레인지에 끌어다 놓아봐!", appliance: "stove" },
      { type: "appliance_run",  message: "맛있게 구워지는 중... 🔥", duration: 3000, appliance: "stove" },
      { type: "appliance_open", message: "다 됐다! 뚜껑을 열어봐", appliance: "stove" },
      { type: "take_out", message: "빵을 꺼내자!" },
      { type: "spread", message: "딸기잼을 발라봐! 빵 위에서 문질문질~", color: "pink", target: 0.45 },
      { type: "eat", message: "친구에게 빵을 줘봐! 입에 끌어다 놓으면 냠냠 먹어요", bites: 3 },
      { type: "finale", message: "완성! 정말 잘했어! 🎉", button: "다시 하기" },
    ],
  },
  {
    id: "orange_cake",
    name: "오렌지 케익",
    finalImage: "/assets/orange-cake.png",
    rawEmoji: "🥞",
    cookedEmoji: "🥧",
    spreadColor: "orange",
    steps: [
      { type: "talk", message: "오늘은 오렌지색 케익을 만들어 볼까? 🍊", button: "알았어!" },
      {
        type: "ingredients",
        message: "재료를 볼에 담아봐! 끌어다 놓으면 돼",
        items: [
          { emoji: "🌾", label: "밀가루" },
          { emoji: "🥛", label: "우유" },
          { emoji: "🍊", label: "오렌지" },
          { emoji: "🥚", label: "달걀" },
        ],
      },
      { type: "knead", message: "반죽을 조물조물! 5번 눌러봐",       target: 5 },
      { type: "roll",  message: "동그랗게 모양 잡아봐! 5번 더!",     target: 5 },
      { type: "appliance_in",   message: "안 구운 케익을 에어프라이기에 끌어다 놓아봐!", appliance: "air_fryer" },
      { type: "appliance_run",  message: "에어프라이기로 굽는 중... 💨", duration: 3000, appliance: "air_fryer" },
      { type: "appliance_open", message: "다 됐다! 문을 열어봐",     appliance: "air_fryer" },
      { type: "take_out", message: "케익을 꺼내자!" },
      { type: "spread", message: "오렌지 생크림을 발라봐! 케익 위에서 문질문질~", color: "orange", target: 0.45 },
      { type: "eat", message: "친구에게 케익을 줘봐! 입에 끌어다 놓으면 냠냠 먹어요", bites: 3 },
      { type: "finale", message: "완성! 정말 잘했어! 🎉", button: "다시 하기" },
    ],
  },
];

export function pickRandomRecipe(): Recipe {
  // 개발/디버깅용: window.__forceRecipe = "orange_cake" 등으로 특정 레시피 강제
  if (typeof window !== "undefined") {
    const forced = (window as unknown as { __forceRecipe?: string }).__forceRecipe;
    if (forced) {
      const found = RECIPES.find((r) => r.id === forced);
      if (found) return found;
    }
  }
  return RECIPES[Math.floor(Math.random() * RECIPES.length)];
}
