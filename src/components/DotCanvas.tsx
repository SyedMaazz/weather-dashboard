"use client";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";

const GAP = 13;
const DOT_R = 5.0;
const TRAIL_LENGTH = 8;
const TRAIL_REACH = GAP * 1.5;
const HEAD_REACH = GAP * 1.8;
const SHRINK_RADIUS = GAP * 4;

// Tight cloud — 6 rows × 10 cols, no padding
const CLOUD_SHAPE = [
  [0,0,0,1,1,1,0,0,0,0],
  [0,0,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,0],
];
const CLOUD_SHAPE_ROWS = 6;
const CLOUD_SHAPE_COLS = 10;

export default function DotCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const [, forceRender] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const COLS = dims.w > 0 ? Math.floor(dims.w / GAP) : 0;
  const ROWS = dims.h > 0 ? Math.floor(dims.h / GAP) : 0;
  const VW = COLS * GAP;
  const VH = ROWS * GAP;

  // Center cloud in grid — recompute when dims change
  const CLOUD_DOTS = useMemo(() => {
    const set = new Set<string>();
    if (COLS === 0 || ROWS === 0) return set;
    const offsetR = Math.floor((ROWS - CLOUD_SHAPE_ROWS) / 2);
    const offsetC = Math.floor((COLS - CLOUD_SHAPE_COLS) / 2);
    for (let ri = 0; ri < CLOUD_SHAPE_ROWS; ri++) {
      for (let ci = 0; ci < CLOUD_SHAPE_COLS; ci++) {
        if (CLOUD_SHAPE[ri][ci] === 1) {
          set.add(`${ri + offsetR}-${ci + offsetC}`);
        }
      }
    }
    return set;
  }, [COLS, ROWS]);

  // Bounding box of cloud in SVG units for masking
  const cloudMask = useMemo(() => {
    if (COLS === 0 || ROWS === 0) return { x: 0, y: 0, w: 0, h: 0 };
    const offsetR = Math.floor((ROWS - CLOUD_SHAPE_ROWS) / 2);
    const offsetC = Math.floor((COLS - CLOUD_SHAPE_COLS) / 2);
    return {
      x: offsetC * GAP,
      y: offsetR * GAP,
      w: CLOUD_SHAPE_COLS * GAP,
      h: CLOUD_SHAPE_ROWS * GAP,
    };
  }, [COLS, ROWS]);

  const toSVG = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }, []);

  const onMove = useCallback((e: React.MouseEvent) => {
    const pos = toSVG(e);
    if (!pos) return;
    setMouse(pos);
    trailRef.current = [pos, ...trailRef.current].slice(0, TRAIL_LENGTH);
    forceRender(n => n + 1);
  }, [toSVG]);

  const onLeave = useCallback(() => {
    setMouse(null);
    const decay = () => {
      if (trailRef.current.length === 0) return;
      trailRef.current = trailRef.current.slice(0, -1);
      forceRender(n => n + 1);
      timerRef.current = setTimeout(decay, 40);
    };
    decay();
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const trail = trailRef.current;
  const dotMap = new Map<string, number>();

  if (trail.length > 0 && COLS > 0) {
    for (let ri = 0; ri < ROWS; ri++) {
      for (let ci = 0; ci < COLS; ci++) {
        const key = `${ri}-${ci}`;
        if (CLOUD_DOTS.has(key)) continue;
        const cx = ci * GAP + GAP / 2;
        const cy = ri * GAP + GAP / 2;
        let bestScore = 0;

        trail.forEach((pt, idx) => {
          const dist = Math.hypot(cx - pt.x, cy - pt.y);
          if (dist < TRAIL_REACH) {
            const score = 1 - idx / TRAIL_LENGTH;
            if (score > bestScore) bestScore = score;
          }
        });

        const headDist = Math.hypot(cx - trail[0].x, cy - trail[0].y);
        if (headDist < HEAD_REACH && bestScore < 1) bestScore = 1;

        if (bestScore > 0) dotMap.set(key, bestScore);
      }
    }
  }

  const bgDots: React.ReactNode[] = [];
  const cloudDots: React.ReactNode[] = [];

  for (let ri = 0; ri < ROWS; ri++) {
    for (let ci = 0; ci < COLS; ci++) {
      const key = `${ri}-${ci}`;
      const cx = ci * GAP + GAP / 2;
      const cy = ri * GAP + GAP / 2;
      const isCloud = CLOUD_DOTS.has(key);

      if (isCloud) {
        // Cloud dots always rendered on top
        // Use trail[0] (updated via ref, no state lag) for instant shrink response
        let r = DOT_R;
        let transition = "r 0.3s ease-out";
        const cursorPos = trail.length > 0 ? trail[0] : null;
        if (cursorPos) {
          const dist = Math.hypot(cx - cursorPos.x, cy - cursorPos.y);
          if (dist < SHRINK_RADIUS) {
            const t = Math.cos((dist / SHRINK_RADIUS) * (Math.PI / 2));
            r = DOT_R * (1 - 0.85 * t);
            transition = "r 0.06s ease-in";
          }
        }
        cloudDots.push(
          <circle key={key} cx={cx} cy={cy} r={r}
            fill="white" fillOpacity={1}
            style={{ transition }}
          />
        );
      } else {
        const score = dotMap.get(key) || 0;
        const isHead = trail.length > 0 &&
          Math.hypot(cx - trail[0].x, cy - trail[0].y) < HEAD_REACH;
        bgDots.push(
          <circle key={key} cx={cx} cy={cy}
            r={score > 0 ? DOT_R : 0}
            fill="white"
            fillOpacity={score > 0 ? score : 0}
            style={{
              transition: isHead
                ? "r 0.08s ease-out, fill-opacity 0.08s ease-out"
                : "r 0.45s ease-out, fill-opacity 0.45s ease-out",
            }}
          />
        );
      }
    }
  }
  // kept separate for layered rendering

  return (
    <section className="h-[283.5px] overflow-hidden">
      <div ref={containerRef} className="w-full h-full">
        {dims.w > 0 && (
          <svg
            ref={svgRef}
            width={dims.w}
            height={dims.h}
            viewBox={`0 0 ${VW} ${VH}`}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ display: "block", cursor: "none", width: "100%", height: "100%" }}
          >
            <rect width={VW} height={VH} fill="transparent" />
            {bgDots}
            {/* Black mask over cloud area so trail never shows through */}
            <rect
              x={cloudMask.x} y={cloudMask.y}
              width={cloudMask.w} height={cloudMask.h}
              fill="black"
            />
            {cloudDots}
          </svg>
        )}
      </div>
    </section>
  );
}