import { Recipe, SpreadColor } from "./types";

interface FruitDef {
  id: string;
  name: string;
  fruit: string;
  fruitEmoji: string;
  color: SpreadColor;
}

/** 우유 레시피 7종 (딸기~포도) — 모두 같은 7-스텝 흐름 */
const makeMilkRecipes = (): Recipe[] => {
  const fruits: FruitDef[] = [
    { id: "strawberry_milk", name: "딸기우유",       fruit: "딸기",     fruitEmoji: "🍓", color: "blush" },
    { id: "orange_milk",     name: "오렌지우유",     fruit: "오렌지",   fruitEmoji: "🍊", color: "orange" },
    { id: "banana_milk",     name: "바나나우유",     fruit: "바나나",   fruitEmoji: "🍌", color: "yellow" },
    { id: "melon_milk",      name: "메론우유",       fruit: "메론",     fruitEmoji: "🍈", color: "green" },
    { id: "blueberry_milk",  name: "블루베리우유",   fruit: "블루베리", fruitEmoji: "🫐", color: "blue" },
    { id: "plum_milk",       name: "자두우유",       fruit: "자두",     fruitEmoji: "🍑", color: "indigo" },
    { id: "grape_milk",      name: "포도우유",       fruit: "포도",     fruitEmoji: "🍇", color: "purple" },
  ];

  return fruits.map<Recipe>(({ id, name, fruit, fruitEmoji, color }) => ({
    id,
    name,
    category: "milk",
    finalImage: `/assets/${id.replace(/_/g, "-")}.png`,
    rawEmoji: fruitEmoji,
    cookedEmoji: "🥤",
    spreadColor: color,
    steps: [
      { type: "talk", message: `오늘은 ${name}를 만들어 볼까? ${fruitEmoji}🥛`, button: "알았어!" },
      { type: "prep", kind: "wash",  emoji: fruitEmoji, message: `${fruit}를 깨끗이 씻어봐! 💧`, target: 5 },
      { type: "prep", kind: "trim",  emoji: fruitEmoji, message: `칼로 ${fruit}를 손질해봐! 🔪`, target: 4 },
      { type: "prep", kind: "chop",  emoji: fruitEmoji, message: `잘게 잘라봐! 🔪✂️`, target: 4 },
      { type: "appliance_in",  message: `${fruit}를 믹서기에 끌어다 놓아봐!`, appliance: "blender" },
      { type: "pour",          message: "믹서기에 우유를 부어봐! 촤르르~", emoji: "🥛", label: "우유", taps: 3 },
      { type: "appliance_run", message: "믹서기를 돌려봐! 위잉~ 🌀", duration: 3000, appliance: "blender" },
      { type: "eat", message: `친구에게 ${name}를 줘봐! 입에 끌어다 놓으면 냠냠 마셔요`, bites: 3 },
      { type: "finale", message: "완성! 정말 잘했어! 🎉", button: "다시 하기" },
    ],
  }));
};

/** 아이스크림 레시피 7종 (딸기~포도) — 모두 같은 7-스텝 흐름 */
const makeIcecreamRecipes = (): Recipe[] => {
  const fruits: FruitDef[] = [
    { id: "strawberry_icecream", name: "딸기 아이스크림",     fruit: "딸기",     fruitEmoji: "🍓", color: "blush" },
    { id: "orange_icecream",     name: "오렌지 아이스크림",   fruit: "오렌지",   fruitEmoji: "🍊", color: "orange" },
    { id: "banana_icecream",     name: "바나나 아이스크림",   fruit: "바나나",   fruitEmoji: "🍌", color: "yellow" },
    { id: "melon_icecream",      name: "메론 아이스크림",     fruit: "메론",     fruitEmoji: "🍈", color: "green" },
    { id: "blueberry_icecream",  name: "블루베리 아이스크림", fruit: "블루베리", fruitEmoji: "🫐", color: "blue" },
    { id: "plum_icecream",       name: "자두 아이스크림",     fruit: "자두",     fruitEmoji: "🍑", color: "indigo" },
    { id: "grape_icecream",      name: "포도 아이스크림",     fruit: "포도",     fruitEmoji: "🍇", color: "purple" },
  ];

  return fruits.map<Recipe>(({ id, name, fruit, fruitEmoji, color }) => ({
    id,
    name,
    category: "icecream",
    finalImage: `/assets/${id.replace(/_/g, "-")}.png`,
    rawEmoji: "🍨",
    cookedEmoji: "🍦",
    spreadColor: color,
    steps: [
      { type: "talk", message: `오늘은 ${name}을 만들어 볼까? ${fruitEmoji}🍦`, button: "알았어!" },
      { type: "prep", kind: "wash", emoji: fruitEmoji, message: `${fruit}를 깨끗이 씻어봐! 💧`, target: 5 },
      { type: "prep", kind: "chop", emoji: fruitEmoji, message: `잘게 잘라봐! 🔪✂️`, target: 4 },
      { type: "pour", emoji: "🥛", label: "생크림", message: "생크림을 부어봐! 촤르르~", taps: 3 },
      { type: "whisk", message: "거품기로 빙글빙글 섞어봐! 세 바퀴~", target: 3 },
      { type: "appliance_in",  message: `${fruit} 크림을 냉동실에 끌어다 놓아봐!`, appliance: "freezer" },
      { type: "appliance_run", message: "꽁꽁 얼리는 중... ❄️", duration: 3000, appliance: "freezer" },
      { type: "eat", message: `친구에게 ${name}을 줘봐! 입에 끌어다 놓으면 냠냠 먹어요`, bites: 3 },
      { type: "finale", message: "완성! 정말 잘했어! 🎉", button: "다시 하기" },
    ],
  }));
};

/** 새 레시피는 이 배열에 한 덩어리만 추가하면 됨 */
export const RECIPES: Recipe[] = [
  // ========================================
  // 케잌 카테고리 (딸기 ~ 포도)
  // ========================================
  {
    id: "strawberry_cake",
    name: "딸기 케잌",
    category: "cake",
    finalImage: "/assets/strawberry-cake.png",
    rawEmoji: "🥞",
    cookedEmoji: "🍰",
    spreadColor: "pink",
    steps: [
      { type: "talk", message: "오늘은 딸기 케잌을 만들어 볼까? 🍓", button: "알았어!" },
      {
        type: "ingredients",
        message: "딸기를 볼에 담아봐!",
        items: [{ emoji: "🍓", label: "딸기" }],
      },
      { type: "crack_egg", message: "달걀을 탁탁 깨봐! 💥", taps: 3 },
      { type: "whisk",     message: "거품기로 빙글빙글 저어봐! 세 바퀴~", target: 3 },
      { type: "pour",      message: "우유를 부어봐! 촤르르~", emoji: "🥛", label: "우유", taps: 3 },
      { type: "pour",      message: "밀가루를 넣어봐! 솔솔~", emoji: "🌾", label: "밀가루", taps: 3 },
      { type: "knead",     message: "반죽을 조물조물! 5번 눌러봐", target: 5 },
      { type: "appliance_in",   message: "케잌을 에어프라이기에 끌어다 놓아봐!", appliance: "air_fryer" },
      { type: "appliance_run",  message: "에어프라이기로 굽는 중... 💨", duration: 3000, appliance: "air_fryer" },
      { type: "appliance_open", message: "다 됐다! 문을 열어봐", appliance: "air_fryer" },
      { type: "take_out", message: "케잌을 꺼내자!" },
      { type: "spread", message: "딸기잼을 발라봐! 케잌 위에서 문질문질~", color: "pink", target: 0.45 },
      { type: "eat", message: "친구에게 케잌을 줘봐! 입에 끌어다 놓으면 냠냠 먹어요", bites: 3 },
      { type: "finale", message: "완성! 정말 잘했어! 🎉", button: "다시 하기" },
    ],
  },
  {
    id: "orange_cake",
    name: "오렌지 케잌",
    category: "cake",
    finalImage: "/assets/orange-cake.png",
    rawEmoji: "🥞",
    cookedEmoji: "🥧",
    spreadColor: "orange",
    steps: [
      { type: "talk", message: "오늘은 오렌지 케잌을 만들어 볼까? 🍊", button: "알았어!" },
      {
        type: "ingredients",
        message: "오렌지를 볼에 담아봐!",
        items: [
          { emoji: "🍊", label: "오렌지" },
        ],
      },
      { type: "crack_egg", message: "달걀을 탁탁 깨봐! 💥", taps: 3 },
      { type: "whisk",     message: "거품기로 빙글빙글 저어봐! 세 바퀴~", target: 3 },
      { type: "pour",      message: "우유를 부어봐! 촤르르~", emoji: "🥛", label: "우유", taps: 3 },
      { type: "pour",      message: "밀가루를 넣어봐! 솔솔~", emoji: "🌾", label: "밀가루", taps: 3 },
      { type: "knead",     message: "반죽을 조물조물! 5번 눌러봐", target: 5 },
      { type: "appliance_in",   message: "안 구운 케잌을 에어프라이기에 끌어다 놓아봐!", appliance: "air_fryer" },
      { type: "appliance_run",  message: "에어프라이기로 굽는 중... 💨", duration: 3000, appliance: "air_fryer" },
      { type: "appliance_open", message: "다 됐다! 문을 열어봐",     appliance: "air_fryer" },
      { type: "take_out", message: "케잌을 꺼내자!" },
      { type: "spread", message: "오렌지 생크림을 발라봐! 케잌 위에서 문질문질~", color: "orange", target: 0.45 },
      { type: "eat", message: "친구에게 케잌을 줘봐! 입에 끌어다 놓으면 냠냠 먹어요", bites: 3 },
      { type: "finale", message: "완성! 정말 잘했어! 🎉", button: "다시 하기" },
    ],
  },
  {
    id: "banana_cake",
    name: "바나나 케잌",
    category: "cake",
    finalImage: "/assets/banana-cake.png",
    rawEmoji: "🥞",
    cookedEmoji: "🎂",
    spreadColor: "yellow",
    steps: [
      { type: "talk", message: "오늘은 바나나 케잌을 만들어 볼까? 🍌", button: "알았어!" },
      {
        type: "ingredients",
        message: "바나나를 볼에 담아봐!",
        items: [
          { emoji: "🍌", label: "바나나" },
        ],
      },
      { type: "crack_egg", message: "달걀을 탁탁 깨봐! 💥", taps: 3 },
      { type: "whisk",     message: "거품기로 빙글빙글 저어봐! 세 바퀴~", target: 3 },
      { type: "pour",      message: "우유를 부어봐! 촤르르~", emoji: "🥛", label: "우유", taps: 3 },
      { type: "pour",      message: "밀가루를 넣어봐! 솔솔~", emoji: "🌾", label: "밀가루", taps: 3 },
      { type: "knead",     message: "반죽을 조물조물! 5번 눌러봐", target: 5 },
      { type: "appliance_in",   message: "케잌을 에어프라이기에 끌어다 놓아봐!", appliance: "air_fryer" },
      { type: "appliance_run",  message: "에어프라이기로 굽는 중... 💨", duration: 3000, appliance: "air_fryer" },
      { type: "appliance_open", message: "다 됐다! 문을 열어봐",     appliance: "air_fryer" },
      { type: "take_out", message: "케잌을 꺼내자!" },
      { type: "spread", message: "바나나 크림을 발라봐! 케잌 위에서 문질문질~", color: "yellow", target: 0.45 },
      { type: "eat", message: "친구에게 케잌을 줘봐! 입에 끌어다 놓으면 냠냠 먹어요", bites: 3 },
      { type: "finale", message: "완성! 정말 잘했어! 🎉", button: "다시 하기" },
    ],
  },
  {
    id: "melon_cake",
    name: "메론 케잌",
    category: "cake",
    finalImage: "/assets/melon-cake.png",
    rawEmoji: "🥞",
    cookedEmoji: "🍮",
    spreadColor: "green",
    steps: [
      { type: "talk", message: "오늘은 메론 케잌을 만들어 볼까? 🍈", button: "알았어!" },
      {
        type: "ingredients",
        message: "메론을 볼에 담아봐!",
        items: [{ emoji: "🍈", label: "메론" }],
      },
      { type: "crack_egg", message: "달걀을 탁탁 깨봐! 💥", taps: 3 },
      { type: "whisk",     message: "거품기로 빙글빙글 저어봐! 세 바퀴~", target: 3 },
      { type: "pour",      message: "우유를 부어봐! 촤르르~", emoji: "🥛", label: "우유", taps: 3 },
      { type: "pour",      message: "밀가루를 넣어봐! 솔솔~", emoji: "🌾", label: "밀가루", taps: 3 },
      { type: "knead",     message: "반죽을 조물조물! 5번 눌러봐", target: 5 },
      { type: "appliance_in",   message: "케잌을 에어프라이기에 끌어다 놓아봐!", appliance: "air_fryer" },
      { type: "appliance_run",  message: "에어프라이기로 굽는 중... 💨", duration: 3000, appliance: "air_fryer" },
      { type: "appliance_open", message: "다 됐다! 문을 열어봐", appliance: "air_fryer" },
      { type: "take_out", message: "케잌을 꺼내자!" },
      { type: "spread", message: "메론 크림을 발라봐! 케잌 위에서 문질문질~", color: "green", target: 0.45 },
      { type: "eat", message: "친구에게 케잌을 줘봐! 입에 끌어다 놓으면 냠냠 먹어요", bites: 3 },
      { type: "finale", message: "완성! 정말 잘했어! 🎉", button: "다시 하기" },
    ],
  },
  {
    id: "blueberry_cake",
    name: "블루베리 케잌",
    category: "cake",
    finalImage: "/assets/blueberry-cake.png",
    rawEmoji: "🥞",
    cookedEmoji: "🍰",
    spreadColor: "blue",
    steps: [
      { type: "talk", message: "오늘은 블루베리 케잌을 만들어 볼까? 🫐", button: "알았어!" },
      {
        type: "ingredients",
        message: "블루베리를 볼에 담아봐!",
        items: [{ emoji: "🫐", label: "블루베리" }],
      },
      { type: "crack_egg", message: "달걀을 탁탁 깨봐! 💥", taps: 3 },
      { type: "whisk",     message: "거품기로 빙글빙글 저어봐! 세 바퀴~", target: 3 },
      { type: "pour",      message: "우유를 부어봐! 촤르르~", emoji: "🥛", label: "우유", taps: 3 },
      { type: "pour",      message: "밀가루를 넣어봐! 솔솔~", emoji: "🌾", label: "밀가루", taps: 3 },
      { type: "knead",     message: "반죽을 조물조물! 5번 눌러봐", target: 5 },
      { type: "appliance_in",   message: "케잌을 에어프라이기에 끌어다 놓아봐!", appliance: "air_fryer" },
      { type: "appliance_run",  message: "에어프라이기로 굽는 중... 💨", duration: 3000, appliance: "air_fryer" },
      { type: "appliance_open", message: "다 됐다! 문을 열어봐", appliance: "air_fryer" },
      { type: "take_out", message: "케잌을 꺼내자!" },
      { type: "spread", message: "블루베리잼을 발라봐! 케잌 위에서 문질문질~", color: "blue", target: 0.45 },
      { type: "eat", message: "친구에게 케잌을 줘봐! 입에 끌어다 놓으면 냠냠 먹어요", bites: 3 },
      { type: "finale", message: "완성! 정말 잘했어! 🎉", button: "다시 하기" },
    ],
  },
  {
    id: "plum_cake",
    name: "자두 케잌",
    category: "cake",
    finalImage: "/assets/plum-cake.png",
    rawEmoji: "🥞",
    cookedEmoji: "🧁",
    spreadColor: "indigo",
    steps: [
      { type: "talk", message: "오늘은 자두 케잌을 만들어 볼까? 🍑", button: "알았어!" },
      {
        type: "ingredients",
        message: "자두를 볼에 담아봐!",
        items: [{ emoji: "🍑", label: "자두" }],
      },
      { type: "crack_egg", message: "달걀을 탁탁 깨봐! 💥", taps: 3 },
      { type: "whisk",     message: "거품기로 빙글빙글 저어봐! 세 바퀴~", target: 3 },
      { type: "pour",      message: "우유를 부어봐! 촤르르~", emoji: "🥛", label: "우유", taps: 3 },
      { type: "pour",      message: "밀가루를 넣어봐! 솔솔~", emoji: "🌾", label: "밀가루", taps: 3 },
      { type: "knead",     message: "반죽을 조물조물! 5번 눌러봐", target: 5 },
      { type: "appliance_in",   message: "케잌을 에어프라이기에 끌어다 놓아봐!", appliance: "air_fryer" },
      { type: "appliance_run",  message: "에어프라이기로 굽는 중... 💨", duration: 3000, appliance: "air_fryer" },
      { type: "appliance_open", message: "다 됐다! 문을 열어봐", appliance: "air_fryer" },
      { type: "take_out", message: "케잌을 꺼내자!" },
      { type: "spread", message: "자두잼을 발라봐! 케잌 위에서 문질문질~", color: "indigo", target: 0.45 },
      { type: "eat", message: "친구에게 케잌을 줘봐! 입에 끌어다 놓으면 냠냠 먹어요", bites: 3 },
      { type: "finale", message: "완성! 정말 잘했어! 🎉", button: "다시 하기" },
    ],
  },
  {
    id: "grape_cake",
    name: "포도 케잌",
    category: "cake",
    finalImage: "/assets/grape-cake.png",
    rawEmoji: "🥞",
    cookedEmoji: "🍩",
    spreadColor: "purple",
    steps: [
      { type: "talk", message: "오늘은 포도 케잌을 만들어 볼까? 🍇", button: "알았어!" },
      {
        type: "ingredients",
        message: "포도를 볼에 담아봐!",
        items: [{ emoji: "🍇", label: "포도" }],
      },
      { type: "crack_egg", message: "달걀을 탁탁 깨봐! 💥", taps: 3 },
      { type: "whisk",     message: "거품기로 빙글빙글 저어봐! 세 바퀴~", target: 3 },
      { type: "pour",      message: "우유를 부어봐! 촤르르~", emoji: "🥛", label: "우유", taps: 3 },
      { type: "pour",      message: "밀가루를 넣어봐! 솔솔~", emoji: "🌾", label: "밀가루", taps: 3 },
      { type: "knead",     message: "반죽을 조물조물! 5번 눌러봐", target: 5 },
      { type: "appliance_in",   message: "케잌을 에어프라이기에 끌어다 놓아봐!", appliance: "air_fryer" },
      { type: "appliance_run",  message: "에어프라이기로 굽는 중... 💨", duration: 3000, appliance: "air_fryer" },
      { type: "appliance_open", message: "다 됐다! 문을 열어봐", appliance: "air_fryer" },
      { type: "take_out", message: "케잌을 꺼내자!" },
      { type: "spread", message: "포도잼을 발라봐! 케잌 위에서 문질문질~", color: "purple", target: 0.45 },
      { type: "eat", message: "친구에게 케잌을 줘봐! 입에 끌어다 놓으면 냠냠 먹어요", bites: 3 },
      { type: "finale", message: "완성! 정말 잘했어! 🎉", button: "다시 하기" },
    ],
  },

  // ========================================
  // 우유 카테고리 (딸기 ~ 포도)
  // ========================================
  ...makeMilkRecipes(),

  // ========================================
  // 아이스크림 카테고리 (딸기 ~ 포도)
  // ========================================
  ...makeIcecreamRecipes(),
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
