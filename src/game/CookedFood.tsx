"use client";

import type { Recipe, SpreadColor } from "./types";

export const SHELL_FILL: Record<SpreadColor, string> = {
  pink:   "#ffa8c8",
  blush:  "#ffd1e0",
  orange: "#ffc880",
  yellow: "#ffe566",
  green:  "#a0e87a",
  blue:   "#9ab4ff",
  indigo: "#a89cdd",
  purple: "#cc88ee",
};

export const SHELL_EDGE: Record<SpreadColor, string> = {
  pink:   "#ff5d92",
  blush:  "#ffaacc",
  orange: "#ff8a3d",
  yellow: "#f5b800",
  green:  "#3db840",
  blue:   "#4466ee",
  indigo: "#5544bb",
  purple: "#9933cc",
};

/** 마카롱 모양 (껍질 2장 + 크림). 부모 font-size에 비례해 크기 조절. */
export function MacaronShape({ color = "pink" }: { color?: SpreadColor }) {
  const fill = SHELL_FILL[color];
  const edge = SHELL_EDGE[color];
  return (
    <svg
      width="1.15em"
      height="1em"
      viewBox="0 0 115 100"
      style={{
        verticalAlign: "middle",
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.18))",
        overflow: "visible",
      }}
      aria-hidden="true"
    >
      {/* 위 껍질 */}
      <ellipse cx="57.5" cy="32" rx="50" ry="22" fill={fill} stroke={edge} strokeWidth="2" />
      {/* 위 껍질 발(피에) */}
      <g fill={edge} opacity="0.55">
        <circle cx="14"  cy="46" r="3.2" />
        <circle cx="26"  cy="50" r="3.5" />
        <circle cx="40"  cy="51" r="3.2" />
        <circle cx="55"  cy="52" r="3.5" />
        <circle cx="70"  cy="51" r="3.2" />
        <circle cx="84"  cy="50" r="3.5" />
        <circle cx="98"  cy="46" r="3.2" />
      </g>
      {/* 크림 */}
      <rect x="12" y="46" width="91" height="10" fill="#fff5e0" stroke="#e8d8b0" strokeWidth="1" rx="1" />
      {/* 아래 껍질 */}
      <ellipse cx="57.5" cy="70" rx="50" ry="22" fill={fill} stroke={edge} strokeWidth="2" />
      {/* 아래 껍질 발 */}
      <g fill={edge} opacity="0.55">
        <circle cx="14"  cy="56" r="3.2" />
        <circle cx="26"  cy="52" r="3.5" />
        <circle cx="40"  cy="51" r="3.2" />
        <circle cx="55"  cy="50" r="3.5" />
        <circle cx="70"  cy="51" r="3.2" />
        <circle cx="84"  cy="52" r="3.5" />
        <circle cx="98"  cy="56" r="3.2" />
      </g>
      {/* 윗면 하이라이트 */}
      <ellipse cx="40" cy="22" rx="14" ry="5" fill="rgba(255,255,255,0.55)" />
      <ellipse cx="40" cy="60" rx="12" ry="4" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

/** 한 개 껍질 (안 구운 / 구운 공통) */
function Shell({
  color,
  cooked,
  size = 28,
}: {
  color: SpreadColor;
  cooked: boolean;
  size?: number;
}) {
  const fill = SHELL_FILL[color];
  const edge = SHELL_EDGE[color];
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 50 28">
      <ellipse cx="25" cy="14" rx="22" ry="11" fill={fill} stroke={edge} strokeWidth="1.5" />
      {cooked && (
        <g fill={edge} opacity="0.55">
          <circle cx="8"  cy="22" r="1.6" />
          <circle cx="15" cy="24" r="1.7" />
          <circle cx="25" cy="25" r="1.7" />
          <circle cx="35" cy="24" r="1.7" />
          <circle cx="42" cy="22" r="1.6" />
        </g>
      )}
      <ellipse cx="18" cy="9" rx="6" ry="2" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}

/** 쟁반에 마카롱 껍질 N개 (기본 6개). 안 구운 / 구운 모드. */
export function MacaronTray({
  color,
  cooked,
  count = 6,
  size = 36,
}: {
  color: SpreadColor;
  cooked: boolean;
  count?: number;
  size?: number;
}) {
  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 6,
        padding: 8,
        background: "linear-gradient(180deg, #e8d5b0 0%, #c8a875 100%)",
        borderRadius: 10,
        border: "2px solid #8a6a40",
        boxShadow: "0 4px 0 #6a4d28, inset 0 -3px 0 rgba(0,0,0,0.15)",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Shell key={i} color={color} cooked={cooked} size={size} />
      ))}
    </div>
  );
}

/** 완성된 음식: 마카롱은 SVG, 그 외 카테고리는 cookedEmoji 텍스트. */
export default function CookedFood({ recipe }: { recipe: Recipe }) {
  if (recipe.category === "macaron") {
    return <MacaronShape color={recipe.spreadColor ?? "pink"} />;
  }
  return <>{recipe.cookedEmoji}</>;
}
