/* 레시피 데이터 - 새 음식 추가는 여기에 한 덩어리만 추가하면 됨 */

const RECIPES = {
  strawberry_bread: {
    name: "딸기 빵",
    color: "핑크색",
    finalImage: "assets/strawberry-bread.png", // 없으면 그라디언트 케이크가 나옴
    steps: [
      {
        type: "talk",
        message: "오늘은 핑크색 음식을 만들어 볼까? 🎀",
        button: "알았어!"
      },
      {
        type: "ingredients",
        message: "재료를 모아왔어! 톡톡 눌러봐",
        items: [
          { emoji: "🌾", label: "밀가루" },
          { emoji: "🥛", label: "우유" },
          { emoji: "🍓", label: "딸기" },
          { emoji: "🥚", label: "달걀" }
        ],
        button: "다 모았어!"
      },
      {
        type: "knead",
        message: "반죽을 조물조물! 5번 눌러봐",
        target: 5,
        button: null // 자동 진행
      },
      {
        type: "roll",
        message: "이번엔 반죽을 밀어볼까? 5번 더!",
        target: 5,
        button: null
      },
      {
        type: "stove_in",
        message: "안 구운 빵을 가스레인지에 넣자!",
        button: null
      },
      {
        type: "cook",
        message: "맛있게 구워지는 중... 🔥",
        duration: 3000,
        button: null
      },
      {
        type: "lid_open",
        message: "다 됐다! 뚜껑을 열어봐",
        button: null
      },
      {
        type: "take_out",
        message: "빵을 꺼내자!",
        button: null
      },
      {
        type: "jam",
        message: "딸기잼을 발라봐! 손가락으로 문질문질~",
        target: 0.4, // 40% 칠해지면 통과
        button: null
      },
      {
        type: "finale",
        message: "완성! 정말 잘했어! 🎉",
        button: "다시 하기"
      }
    ]
  }

  // 새 음식 추가 예시:
  // chocolate_cookie: { name: "초코 쿠키", ... }
};
