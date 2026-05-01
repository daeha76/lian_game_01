"use client";

import { useEffect, useRef } from "react";
import type { SpreadStep as SS, StepProps, SpreadColor } from "../types";
import styles from "./steps.module.css";

interface ColorPalette {
  /** radial gradient stops for jam/cream blob */
  inner: string;
  middle: string;
  outer: string;
  /** highlight dot color */
  shine: string;
  /** 칠해진 픽셀 감지 함수 */
  detect: (r: number, g: number, b: number) => boolean;
}

const PALETTES: Record<SpreadColor, ColorPalette> = {
  pink: {
    inner:  "rgba(255, 90, 130, 0.85)",
    middle: "rgba(220, 50, 100, 0.75)",
    outer:  "rgba(180, 30, 80, 0)",
    shine:  "rgba(255, 220, 230, 0.55)",
    detect: (r, g) => r > 180 && g < 130 && r > g + 50,
  },
  orange: {
    inner:  "rgba(255, 165, 60, 0.85)",
    middle: "rgba(230, 130, 40, 0.75)",
    outer:  "rgba(200, 90, 20, 0)",
    shine:  "rgba(255, 240, 200, 0.55)",
    detect: (r, g, b) => r > 200 && g > 95 && g < 195 && b < 90,
  },
  yellow: {
    inner:  "rgba(255, 218, 50, 0.88)",
    middle: "rgba(235, 185, 20, 0.78)",
    outer:  "rgba(200, 150, 0, 0)",
    shine:  "rgba(255, 255, 200, 0.55)",
    detect: (r, g, b) => r > 200 && g > 150 && b < 85 && (r - g) < 75,
  },
  green: {
    inner:  "rgba(80, 210, 110, 0.88)",
    middle: "rgba(40, 170, 75, 0.78)",
    outer:  "rgba(10, 130, 50, 0)",
    shine:  "rgba(200, 255, 220, 0.55)",
    detect: (r, g) => g > r + 30 && g > 130,
  },
  blue: {
    inner:  "rgba(70, 90, 255, 0.90)",
    middle: "rgba(50, 65, 220, 0.78)",
    outer:  "rgba(30, 45, 180, 0)",
    shine:  "rgba(180, 200, 255, 0.55)",
    // 파랑: B가 R보다 30 이상 높음 — 빵 베이지(B 낮음)와 구분
    detect: (r, _g, b) => b > r + 30 && b > 130,
  },
  indigo: {
    inner:  "rgba(20, 40, 210, 0.90)",
    middle: "rgba(10, 25, 175, 0.78)",
    outer:  "rgba(5, 15, 145, 0)",
    shine:  "rgba(160, 175, 245, 0.55)",
    detect: (r, _g, b) => b > r + 30 && b > 130,
  },
  purple: {
    inner:  "rgba(160, 50, 220, 0.90)",
    middle: "rgba(125, 30, 180, 0.78)",
    outer:  "rgba(90, 15, 145, 0)",
    shine:  "rgba(230, 180, 255, 0.55)",
    // 보라: R과 B 모두 G보다 높음, B도 충분히 높음
    detect: (r, g, b) => r > g + 60 && b > g + 40,
  },
};

const SPREAD_DONE: Record<SpreadColor, string> = {
  pink:   "딸기잼 듬뿍! 맛있겠다 😋",
  orange: "생크림 듬뿍! 맛있겠다 😋",
  yellow: "바나나 크림 듬뿍! 맛있겠다 😋",
  green:  "메론 크림 듬뿍! 맛있겠다 😋",
  blue:   "블루베리잼 듬뿍! 맛있겠다 😋",
  indigo: "자두잼 듬뿍! 맛있겠다 😋",
  purple: "포도잼 듬뿍! 맛있겠다 😋",
};

export default function SpreadStep({ step, onComplete, setMessage }: StepProps<SS>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 360;
    const H = 220;
    canvas.width = W;
    canvas.height = H;

    const palette = PALETTES[step.color];

    function breadPath() {
      const padX = 40;
      const padY = 40;
      const x = padX;
      const y = padY;
      const w = W - padX * 2;
      const h = H - padY * 2;
      ctx!.beginPath();
      ctx!.moveTo(x + h / 2, y);
      ctx!.lineTo(x + w - h / 2, y);
      ctx!.arc(x + w - h / 2, y + h / 2, h / 2, -Math.PI / 2, Math.PI / 2);
      ctx!.lineTo(x + h / 2, y + h);
      ctx!.arc(x + h / 2, y + h / 2, h / 2, Math.PI / 2, -Math.PI / 2);
      ctx!.closePath();
    }

    // 그림자
    ctx.save();
    breadPath();
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.translate(0, 6);
    ctx.fill();
    ctx.restore();

    // 빵/케익 본체
    breadPath();
    const grad = ctx.createLinearGradient(0, 40, 0, H - 40);
    grad.addColorStop(0, "#f5d59a");
    grad.addColorStop(0.5, "#e0a965");
    grad.addColorStop(1, "#b87a3f");
    ctx.fillStyle = grad;
    ctx.fill();

    // 위쪽 하이라이트 + 줄무늬
    ctx.save();
    breadPath();
    ctx.clip();
    const hi = ctx.createLinearGradient(0, 40, 0, 100);
    hi.addColorStop(0, "rgba(255,240,200,0.55)");
    hi.addColorStop(1, "rgba(255,240,200,0)");
    ctx.fillStyle = hi;
    ctx.fillRect(0, 40, W, 60);

    ctx.strokeStyle = "rgba(120, 70, 30, 0.35)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      const cx = W / 2 + i * 55;
      ctx.moveTo(cx - 14, 75);
      ctx.lineTo(cx + 14, 145);
      ctx.stroke();
    }
    ctx.restore();

    // 빵 픽셀 카운트
    let breadPixelCount = 0;
    {
      const initData = ctx.getImageData(0, 0, W, H).data;
      for (let i = 3; i < initData.length; i += 4) {
        if (initData[i] > 100) breadPixelCount++;
      }
    }

    function paintBlob(x: number, y: number, r: number) {
      ctx!.save();
      ctx!.globalCompositeOperation = "source-atop";
      const g = ctx!.createRadialGradient(x - r * 0.2, y - r * 0.2, 0, x, y, r);
      g.addColorStop(0, palette.inner);
      g.addColorStop(0.6, palette.middle);
      g.addColorStop(1, palette.outer);
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, Math.PI * 2);
      ctx!.fill();

      if (Math.random() < 0.45) {
        ctx!.fillStyle = palette.shine;
        ctx!.beginPath();
        ctx!.arc(
          x - r * 0.35 + (Math.random() - 0.5) * 6,
          y - r * 0.35 + (Math.random() - 0.5) * 6,
          1.5 + Math.random() * 2,
          0,
          Math.PI * 2,
        );
        ctx!.fill();
      }
      ctx!.restore();
    }

    function getPos(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const sx = canvas!.width / rect.width;
      const sy = canvas!.height / rect.height;
      return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
    }

    function paintLine(x0: number, y0: number, x1: number, y1: number) {
      const dx = x1 - x0;
      const dy = y1 - y0;
      const dist = Math.hypot(dx, dy);
      const stepDist = 4;
      const n = Math.max(1, Math.ceil(dist / stepDist));
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        paintBlob(x0 + dx * t, y0 + dy * t, 22);
      }
    }

    function checkProgress() {
      const data = ctx!.getImageData(0, 0, W, H).data;
      let painted = 0;
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a < 100) continue;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (palette.detect(r, g, b)) painted++;
      }
      return breadPixelCount > 0 ? painted / breadPixelCount : 0;
    }

    let painting = false;
    let lastX = 0;
    let lastY = 0;

    function onDown(e: PointerEvent) {
      e.preventDefault();
      if (finishedRef.current) return;
      painting = true;
      const pos = getPos(e);
      lastX = pos.x;
      lastY = pos.y;
      paintBlob(pos.x, pos.y, 22);
    }
    function onMove(e: PointerEvent) {
      if (!painting) return;
      e.preventDefault();
      const pos = getPos(e);
      paintLine(lastX, lastY, pos.x, pos.y);
      lastX = pos.x;
      lastY = pos.y;
      if (Math.random() < 0.15) {
        const ratio = checkProgress();
        if (ratio >= step.target) {
          finishedRef.current = true;
          painting = false;
          setMessage(SPREAD_DONE[step.color]);
          setTimeout(onComplete, 800);
        }
      }
    }
    function onUp() {
      painting = false;
    }

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onUp);

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.jamArea}>
      <canvas ref={canvasRef} />
    </div>
  );
}
