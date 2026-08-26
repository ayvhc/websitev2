"use client";

import createGlobe, { type Marker } from "cobe";
import { type CSSProperties, useEffect, useRef, useState } from "react";

type Place = {
  id: string;
  name: string;
  location: [number, number];
  labelOffset: [number, number];
};

const PLACES: Place[] = [
  { id: "taiwan", name: "Taiwan", location: [23.7, 121], labelOffset: [14, 11] },
  { id: "shanghai", name: "Shanghai", location: [31.23, 121.47], labelOffset: [18, -12] },
  { id: "shenzhen", name: "Shenzhen", location: [22.54, 114.06], labelOffset: [-58, 24] },
  { id: "beijing", name: "Beijing", location: [39.9, 116.4], labelOffset: [-53, -17] },
  { id: "hong-kong", name: "Hong Kong", location: [22.32, 114.17], labelOffset: [17, 37] },
  { id: "ho-chi-minh", name: "Ho Chi Minh City", location: [10.82, 106.63], labelOffset: [-92, 28] },
  { id: "jakarta", name: "Jakarta", location: [-6.2, 106.82], labelOffset: [16, 16] },
  { id: "champaign", name: "Champaign", location: [40.12, -88.24], labelOffset: [-73, -14] },
  { id: "new-york", name: "New York", location: [40.71, -74.01], labelOffset: [17, 13] },
];

const MARKERS: Marker[] = PLACES.map(({ id, location }) => ({
  id: `adam-${id}`,
  location,
  size: 0.045,
}));

type LabelStyle = CSSProperties & {
  positionAnchor: string;
  "--label-x": string;
  "--label-y": string;
};

export function TravelMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<number | null>(null);
  const dragRef = useRef(0);
  const rotationRef = useRef(4.45);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = Math.max(1, container.offsetWidth);
    let frame = 0;
    let dark = document.documentElement.dataset.theme === "dark";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(2, window.devicePixelRatio || 1),
      width,
      height: width,
      phi: rotationRef.current,
      theta: 0.19,
      dark: dark ? 1 : 0,
      diffuse: dark ? 1.35 : 1.8,
      mapSamples: 16000,
      mapBrightness: dark ? 2.1 : 4.8,
      mapBaseBrightness: dark ? 0.03 : 0.018,
      baseColor: dark ? [0.72, 0.76, 0.82] : [1, 1, 1],
      markerColor: dark ? [0.46, 0.67, 1] : [0, 0.25, 0.56],
      glowColor: dark ? [0.055, 0.065, 0.085] : [0.98, 0.985, 1],
      markerElevation: 0.025,
      scale: 0.94,
      opacity: 0.96,
      markers: MARKERS,
    });

    const resizeObserver = new ResizeObserver(([entry]) => {
      width = Math.max(1, Math.round(entry.contentRect.width));
    });
    resizeObserver.observe(container);

    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.dataset.theme === "dark";
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const render = () => {
      if (pointerRef.current === null && !prefersReducedMotion.matches) {
        rotationRef.current += 0.0022;
      }
      globe.update({
        width,
        height: width,
        phi: rotationRef.current + dragRef.current,
        dark: dark ? 1 : 0,
        diffuse: dark ? 1.35 : 1.8,
        mapBrightness: dark ? 2.1 : 4.8,
        mapBaseBrightness: dark ? 0.03 : 0.018,
        baseColor: dark ? [0.72, 0.76, 0.82] : [1, 1, 1],
        markerColor: dark ? [0.46, 0.67, 1] : [0, 0.25, 0.56],
        glowColor: dark ? [0.055, 0.065, 0.085] : [0.98, 0.985, 1],
      });
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      globe.destroy();
    };
  }, []);

  const endDrag = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (pointerRef.current === null) return;
    rotationRef.current += dragRef.current;
    dragRef.current = 0;
    pointerRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <figure className={`about-travel-map${dragging ? " is-dragging" : ""}`}>
      <div
        ref={containerRef}
        className="about-travel-map-visual"
        role="img"
        aria-label="An interactive globe marking places where Adam regularly spends time"
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          onPointerDown={(event) => {
            pointerRef.current = event.clientX;
            dragRef.current = 0;
            setDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (pointerRef.current === null) return;
            dragRef.current = (event.clientX - pointerRef.current) / 180;
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
        {PLACES.map((place) => (
          <span
            key={place.id}
            className="about-globe-label"
            style={
              {
                positionAnchor: `--cobe-adam-${place.id}`,
                opacity: `var(--cobe-visible-adam-${place.id}, 0)`,
                "--label-x": `${place.labelOffset[0]}px`,
                "--label-y": `${place.labelOffset[1]}px`,
              } as LabelStyle
            }
          >
            {place.name}
          </span>
        ))}
      </div>
      <figcaption>
        <span>
          You can usually find me
          <em>somewhere around here.</em>
        </span>
      </figcaption>
      <span className="about-globe-hint" aria-hidden="true">drag to explore</span>
      <ul className="sr-only">
        {PLACES.map((place) => (
          <li key={place.id}>{place.name}</li>
        ))}
      </ul>
    </figure>
  );
}
