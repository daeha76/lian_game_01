# 리안이의 요리 게임 🍰

초등학교 1학년 딸이 만들고 싶어한 요리 게임이에요. 단계별 안내를 따라가며 음식을 만들고, 마지막에는 친구 캐릭터에게 먹여줘요.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

PC, 태블릿, 모바일 모두 지원해요.

## 기술 스택

- **Next.js 16** + React 19 (App Router)
- **TypeScript**
- **CSS Modules** (컴포넌트별 스타일)
- 외부 라이브러리 없음 (드래그앤드롭은 Pointer Events로 직접 구현)

## 게임 흐름 (11단계)

1. 시작
2. 재료 모으기 — 4개 재료를 볼에 **드래그**해서 담기
3. 반죽 조물조물 (5번 클릭)
4. 반죽 밀기 (5번 클릭)
5. 빵을 가스레인지에 **드래그**
6. 굽기 🔥
7. 뚜껑 열기
8. 빵 꺼내기
9. 딸기잼 바르기 — 빵 위에서만 발라지는 리얼 페인팅
10. **냠냠 먹이기** — 잼 발린 빵을 캐릭터에 **드래그**해서 3번 베어물기
11. 완성! ✨

## 폴더 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx            # Game 컴포넌트 진입점
│   └── globals.css
└── game/
    ├── Game.tsx            # 게임 엔진 (단계 진행, 메시지 관리)
    ├── Game.module.css
    ├── recipes.ts          # 레시피 데이터 (새 음식 추가 위치)
    ├── types.ts            # 단계 타입 정의
    ├── useDrag.ts          # 드래그앤드롭 훅 (Pointer Events)
    └── steps/              # 단계별 컴포넌트
        ├── TalkStep.tsx
        ├── IngredientsStep.tsx
        ├── DoughStep.tsx       # knead/roll 통합
        ├── StoveInStep.tsx
        ├── CookStep.tsx
        ├── LidOpenStep.tsx
        ├── TakeOutStep.tsx
        ├── JamStep.tsx         # 캔버스 페인팅
        ├── EatStep.tsx         # 캐릭터에게 먹이기
        ├── FinaleStep.tsx
        └── steps.module.css
```

## 새 음식 추가하기

1. [`src/game/recipes.ts`](./src/game/recipes.ts) 의 `RECIPES` 배열에 새 레시피를 한 덩어리 추가
2. 완성 그림 파일을 `public/assets/` 에 두고 `finalImage` 경로 지정
3. 끝 — 시작 시 랜덤으로 선택돼요

## 새 단계 타입 추가하기

1. [`src/game/types.ts`](./src/game/types.ts) 에 새 step 타입 정의
2. `src/game/steps/` 에 새 컴포넌트 파일 추가
3. [`src/game/Game.tsx`](./src/game/Game.tsx) 의 `StepRenderer` switch에 case 추가

## 캐릭터 커스터마이징

현재 [`src/game/steps/EatStep.tsx`](./src/game/steps/EatStep.tsx) 의 `FACES` 배열은 이모지 사용 중. 추후 직접 그린 캐릭터 그림으로 교체 가능.

## 이전 버전

처음에 만들었던 단일 HTML 파일 버전은 [`legacy/`](./legacy) 폴더에 있어요.
