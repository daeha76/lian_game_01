"use client";

import { useEffect, useRef } from "react";
import type { JamStep as JS, StepProps } from "../types";
import styles from "./steps.module.css";

export default function JamStep({ step, onComplete, setMessage }: StepProps<JS>) {
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

    // 빵 본체
    breadPath();
    const grad = ctx.createLinearGradient(0, 40, 0, H - 40);
    grad.addColorStop(0, "#f5d59a");
    grad.addColorStop(0.5, "#e0a965");
    grad.addColorStop(1, "#b87a3f");
    ctx.fillStyle = grad;
    ctx.fill();

    // 위쪽 하이라이트 + 칼집
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

    // 빵 픽셀 카운트 (잼 진행률 계산용)
    let breadPixelCount = 0;
    {
      const initData = ctx.getImageData(0, 0, W, H).data;
      for (let i = 3; i < initData.length; i += 4) {
        if (initData[i] > 100) breadPixelCount++;
      }
    }

    function paintBlob(x: number, y: number, r: number) {
      ctx!.save();
      ctx!.globalCompositeOperation = "source-atop"; // 빵 위에서만 그려짐
      const g = ctx!.createRadialGradient(x - r * 0.2, y - r * 0.2, 0, x, y, r);
      g.addColorStop(0, "rgba(255, 90, 130, 0.85)");
      g.addColorStop(0.6, "rgba(220, 50, 100, 0.75)");
      g.addColorStop(1, "rgba(180, 30, 80, 0)");
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, Math.PI * 2);
      ctx!.fill();

      // 광택 점 (가끔)
      if (Math.random() < 0.45) {
        ctx!.fillStyle = "rgba(255, 220, 230, 0.55)";
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
      return {
        x: (e.clientX - rect.left) * sx,
        y: (e.clientY - rect.top) * sy,
      };
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
      let jam = 0;
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a < 100) continue;
        const r = data[i];
        const g = data[i + 1];
        if (r > 180 && g < 130 && r > g + 50) jam++;
      }
      return breadPixelCount > 0 ? jam / breadPixelCount : 0;
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
          setMessage("잼이 듬뿍! 맛있겠다 😋");
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
