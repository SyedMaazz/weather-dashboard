"use client";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";

const GAP = 13;
const DOT_R = 5.0;
const TRAIL_LENGTH = 8;
const TRAIL_REACH = GAP * 1.5;
const HEAD_REACH = GAP * 1.8;
const SHRINK_RADIUS = GAP * 4;

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

interface DotCanvasProps {
  weatherCode?: number;
}

export default function DotCanvas({ weatherCode }: DotCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const [, forceRender] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const cloudCircleRefs = useRef<Map<string, SVGCircleElement>>(new Map());

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setDims({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const COLS = dims.w > 0 ? Math.floor(dims.w / GAP) : 0;
  const ROWS = dims.h > 0 ? Math.floor(dims.h / GAP) : 0;
  const VW = COLS * GAP;
  const VH = ROWS * GAP;

  const { CLOUD_DOTS, cloudDotPositions } = useMemo(() => {
    const set = new Set<string>();
    const positions = new Map<string, { cx: number; cy: number }>();
    if (COLS === 0 || ROWS === 0) return { CLOUD_DOTS: set, cloudDotPositions: positions };
    const offsetR = Math.floor((ROWS - CLOUD_SHAPE_ROWS) / 2);
    const offsetC = Math.floor((COLS - CLOUD_SHAPE_COLS) / 2);
    for (let ri = 0; ri < CLOUD_SHAPE_ROWS; ri++) {
      for (let ci = 0; ci < CLOUD_SHAPE_COLS; ci++) {
        if (CLOUD_SHAPE[ri][ci] === 1) {
          const key = `${ri + offsetR}-${ci + offsetC}`;
          set.add(key);
          positions.set(key, {
            cx: (ci + offsetC) * GAP + GAP / 2,
            cy: (ri + offsetR) * GAP + GAP / 2,
          });
        }
      }
    }
    return { CLOUD_DOTS: set, cloudDotPositions: positions };
  }, [COLS, ROWS]);

  const toSVG = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }, []);

  const updateCloudShrink = useCallback((pos: { x: number; y: number } | null) => {
    cloudCircleRefs.current.forEach((el, key) => {
      const dotPos = cloudDotPositions.get(key);
      if (!dotPos) return;
      if (!pos) { el.setAttribute("r", String(DOT_R)); return; }
      const dist = Math.hypot(dotPos.cx - pos.x, dotPos.cy - pos.y);
      if (dist < SHRINK_RADIUS) {
        const t = Math.cos((dist / SHRINK_RADIUS) * (Math.PI / 2));
        el.setAttribute("r", String(DOT_R * (1 - 0.85 * t)));
      } else {
        el.setAttribute("r", String(DOT_R));
      }
    });
  }, [cloudDotPositions]);

  const onMove = useCallback((e: React.MouseEvent) => {
    const pos = toSVG(e);
    if (!pos) return;
    mouseRef.current = pos;
    updateCloudShrink(pos);
    trailRef.current = [pos, ...trailRef.current].slice(0, TRAIL_LENGTH);
    forceRender(n => n + 1);
  }, [toSVG, updateCloudShrink]);

  const onLeave = useCallback(() => {
    mouseRef.current = null;
    updateCloudShrink(null);
    const decay = () => {
      if (trailRef.current.length === 0) return;
      trailRef.current = trailRef.current.slice(0, -1);
      forceRender(n => n + 1);
      timerRef.current = setTimeout(decay, 40);
    };
    decay();
  }, [updateCloudShrink]);

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
  const cloudDotsNodes: React.ReactNode[] = [];

  for (let ri = 0; ri < ROWS; ri++) {
    for (let ci = 0; ci < COLS; ci++) {
      const key = `${ri}-${ci}`;
      const cx = ci * GAP + GAP / 2;
      const cy = ri * GAP + GAP / 2;

      if (CLOUD_DOTS.has(key)) {
        cloudDotsNodes.push(
          <circle key={key}
            ref={(el) => { if (el) cloudCircleRefs.current.set(key, el); else cloudCircleRefs.current.delete(key); }}
            cx={cx} cy={cy} r={DOT_R} fill="white" fillOpacity={1}
          />
        );
      } else {
        const score = dotMap.get(key) || 0;
        const isHead = trail.length > 0 && Math.hypot(cx - trail[0].x, cy - trail[0].y) < HEAD_REACH;
        bgDots.push(
          <circle key={key} cx={cx} cy={cy}
            r={score > 0 ? DOT_R : 0}
            fill="white" fillOpacity={score > 0 ? score : 0}
            style={{ transition: isHead ? "r 0.08s ease-out, fill-opacity 0.08s ease-out" : "r 0.45s ease-out, fill-opacity 0.45s ease-out" }}
          />
        );
      }
    }
  }

  return (
    <section className="h-[283.5px] overflow-hidden">
      <div ref={containerRef} className="w-full h-full">
        {dims.w > 0 && (
          <svg ref={svgRef} width={dims.w} height={dims.h} viewBox={`0 0 ${VW} ${VH}`}
            onMouseMove={onMove} onMouseLeave={onLeave}
            style={{ display: "block", cursor: "none", width: "100%", height: "100%" }}
          >
            <rect width={VW} height={VH} fill="transparent" />
            {bgDots}
            {Array.from(cloudDotPositions.entries()).map(([key, pos]) => (
              <circle key={"mask-" + key} cx={pos.cx} cy={pos.cy} r={DOT_R + 2} fill="black" />
            ))}
            {cloudDotsNodes}
          </svg>
        )}
      </div>
    </section>
  );
}