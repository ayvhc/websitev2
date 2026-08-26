"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import landTopology from "world-atlas/land-110m.json";

type Place = {
  name: string;
  coordinates: [number, number];
  labelOffset: [number, number];
};

const PLACES: Place[] = [
  { name: "Taiwan", coordinates: [121, 23.7], labelOffset: [24, 2] },
  { name: "Shanghai", coordinates: [121.47, 31.23], labelOffset: [35, -13] },
  { name: "Shenzhen", coordinates: [114.06, 22.54], labelOffset: [-5, 50] },
  { name: "Beijing", coordinates: [116.4, 39.9], labelOffset: [30, 27] },
  { name: "Hong Kong", coordinates: [114.17, 22.32], labelOffset: [30, 30] },
  { name: "Ho Chi Minh City", coordinates: [106.63, 10.82], labelOffset: [40, 45] },
  { name: "Jakarta", coordinates: [106.82, -6.2], labelOffset: [25, 25] },
  { name: "Champaign", coordinates: [-88.24, 40.12], labelOffset: [-17, -23] },
  { name: "New York", coordinates: [-74.01, 40.71], labelOffset: [-18, 22] },
];

const atlas = landTopology as unknown as { objects: { land: unknown } };
const LAND = feature(landTopology as never, atlas.objects.land as never) as unknown as GeoPermissibleObjects;
const FOCUS_AREA = {
  type: "MultiPoint",
  coordinates: PLACES.map((place) => place.coordinates),
} as unknown as GeoPermissibleObjects;

export function TravelMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const [size, setSize] = useState({ width: 640, height: 270 });
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoveredPlace, setHoveredPlace] = useState<number | null>(null);
  const [dark, setDark] = useState(false);

  const projection = useMemo(() => {
    return geoNaturalEarth1()
      .rotate([-160, 0])
      .fitExtent(
        [
          [34, 25],
          [Math.max(68, size.width - 34), Math.max(50, size.height - 28)],
        ],
        FOCUS_AREA,
      );
  }, [size]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.max(1, width), height: Math.max(1, height) });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateTheme = () => setDark(document.documentElement.dataset.theme === "dark");
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      setProgress(0);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    const start = performance.now();
    const duration = 440;
    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setProgress(eased);
      if (elapsed < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(size.width * dpr);
    canvas.height = Math.round(size.height * dpr);
    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, size.width, size.height);

    const path = geoPath(projection, context);
    context.beginPath();
    path(LAND);
    context.fillStyle = dark ? "rgba(255,255,255,0.018)" : "rgba(0,31,84,0.018)";
    context.fill();
    context.strokeStyle = dark
      ? `rgba(229,233,239,${active ? 0.4 : 0.27})`
      : `rgba(17,17,17,${active ? 0.35 : 0.22})`;
    context.lineWidth = active ? 0.95 : 0.82;
    context.stroke();

    PLACES.forEach((place, index) => {
      const point = projection(place.coordinates);
      if (!point) return;
      const isHovered = hoveredPlace === index;
      context.beginPath();
      context.arc(point[0], point[1], isHovered ? 4.2 : active ? 3.1 : 2.7, 0, Math.PI * 2);
      context.fillStyle = dark ? "#76a9ff" : "#003f8f";
      context.fill();

      const labelAlpha = isHovered ? 1 : progress;
      if ((!active && !isHovered) || labelAlpha <= 0) return;
      const [dx, dy] = place.labelOffset;
      const labelX = point[0] + dx;
      const labelY = point[1] + dy;
      context.beginPath();
      context.moveTo(point[0] + Math.sign(dx) * 4, point[1] + Math.sign(dy) * 3);
      context.lineTo(labelX - Math.sign(dx) * 3, labelY - Math.sign(dy) * 3);
      context.save();
      context.globalAlpha = labelAlpha;
      context.strokeStyle = dark ? "rgba(216,224,235,0.34)" : "rgba(17,17,17,0.25)";
      context.lineWidth = 0.65;
      context.stroke();
      context.font = `${isHovered ? 600 : 500} ${isHovered ? 10 : 8.5}px Arial, sans-serif`;
      context.textAlign = dx < 0 ? "right" : "left";
      context.textBaseline = "middle";
      context.lineJoin = "round";
      context.lineWidth = 3;
      context.strokeStyle = dark ? "rgba(13,16,21,0.88)" : "rgba(255,255,255,0.9)";
      context.strokeText(place.name, labelX, labelY);
      context.fillStyle = dark ? "rgba(244,247,251,0.9)" : "rgba(17,17,17,0.76)";
      context.fillText(place.name, labelX, labelY);
      context.restore();
    });
  }, [active, dark, hoveredPlace, progress, projection, size]);

  const findHoveredPlace = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    let closest: number | null = null;
    let closestDistance = 13;
    PLACES.forEach((place, index) => {
      const point = projection(place.coordinates);
      if (!point) return;
      const distance = Math.hypot(point[0] - x, point[1] - y);
      if (distance < closestDistance) {
        closest = index;
        closestDistance = distance;
      }
    });
    setHoveredPlace(closest);
  };

  return (
    <figure className={`about-travel-map${active ? " is-active" : ""}`}>
      <div
        ref={containerRef}
        className="about-travel-map-visual"
        tabIndex={0}
        role="img"
        aria-label="A map connecting Taiwan, Shanghai, Shenzhen, Beijing, Hong Kong, Ho Chi Minh City, Jakarta, Champaign, and New York"
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => {
          setActive(false);
          setHoveredPlace(null);
        }}
        onPointerMove={findHoveredPlace}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <figcaption>
        <span>
          You can usually find me
          <em>somewhere around here.</em>
        </span>
      </figcaption>
      <ul className="sr-only">
        {PLACES.map((place) => (
          <li key={place.name}>{place.name}</li>
        ))}
      </ul>
    </figure>
  );
}
