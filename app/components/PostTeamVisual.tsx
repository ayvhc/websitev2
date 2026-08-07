"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type PostTeamVisualProps = {
  scrollRef: RefObject<HTMLDivElement | null>;
};

export function PostTeamVisual({ scrollRef }: PostTeamVisualProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const scroller = scrollRef.current;
    const painStart = scroller?.querySelector<HTMLElement>('[data-post="pain-start"]');
    const puzzleEnd = scroller?.querySelector<HTMLElement>('[data-post="puzzle-end"]');

    if (!root || !scroller || !painStart || !puzzleEnd) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const personStrokes = gsap.utils.toArray<SVGPathElement>(".post-person-stroke");
      const shapeStrokes = gsap.utils.toArray<SVGPathElement>(".post-shape-stroke");
      const puzzlePieces = gsap.utils.toArray<SVGGElement>(".puzzle-piece");
      const puzzlePaths = gsap.utils.toArray<SVGPathElement>(".puzzle-piece path");
      const puzzleLabels = gsap.utils.toArray<SVGTextElement>(".puzzle-label");
      const circle = root.querySelector<SVGGElement>(".segmented-circle");
      const square = root.querySelector<SVGGElement>(".outlined-square");
      const ground = root.querySelector<SVGPathElement>(".post-ground-line");

      if (!circle || !square || !ground) return;

      const sourceOffsets = [
        [0, 90], [0, 90],
        [91, -70], [91, -70],
        [-91, -70], [-91, -70],
      ];
      const pieceOffsets = [
        [72, 72], [-72, 72], [72, -72], [-72, -72],
      ];

      gsap.set(root, { autoAlpha: 0 });
      gsap.set(personStrokes, { strokeDasharray: 1, strokeDashoffset: 0 });
      gsap.set(shapeStrokes, { opacity: 0, strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(ground, { opacity: 0, strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(circle, { x: 85, scale: 0.38, transformOrigin: "center" });
      gsap.set(square, { x: -101, scale: 0.38, transformOrigin: "center" });
      gsap.set(puzzlePaths, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(puzzlePieces, {
        opacity: 0,
        x: (index) => pieceOffsets[index][0],
        y: (index) => pieceOffsets[index][1],
      });
      gsap.set(puzzleLabels, { opacity: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: painStart,
          endTrigger: puzzleEnd,
          scroller,
          start: "top 78%",
          end: "bottom 72%",
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(root, { autoAlpha: 1, duration: 0.2 }, 0)
        .to(personStrokes, {
          duration: 1.45,
          ease: "power2.inOut",
          opacity: 0.2,
          rotation: (index) => (index % 2 === 0 ? -9 : 9),
          strokeDashoffset: 1,
          transformOrigin: "center",
          x: (index) => sourceOffsets[index][0],
          y: (index) => sourceOffsets[index][1],
          stagger: 0.06,
        }, 0.25)
        .to(circle, { duration: 1.2, x: 0, scale: 1 }, 1.05)
        .to(square, { duration: 1.2, x: 0, scale: 1 }, 1.05)
        .to(shapeStrokes, {
          duration: 1.1,
          opacity: 1,
          strokeDashoffset: 0,
          stagger: 0.07,
        }, 1.1)
        .to(ground, { duration: 0.8, opacity: 1, strokeDashoffset: 0 }, 1.65);

      const motionStart = 2.55;
      timeline
        .to(circle, { duration: 3.15, ease: "none", rotation: -900, x: -30 }, motionStart)
        .to(circle, { duration: 1.25, ease: "power3.out", rotation: -1080, x: -38 }, motionStart + 3.15)
        .to(ground, { duration: 4.4, ease: "power1.out", x: -78 }, motionStart);

      let squareTime = motionStart;
      let restingX = 0;
      [0.68, 0.78, 0.94, 1.28].forEach((duration) => {
        timeline.to(square, {
          duration,
          ease: "power2.in",
          rotation: 90,
          svgOrigin: "390 314",
          x: restingX - 104,
        }, squareTime);
        restingX -= 10;
        timeline.set(square, { rotation: 0, x: restingX }, squareTime + duration);
        squareTime += duration;
      });

      const puzzleStart = motionStart + 4.5;
      timeline
        .to(shapeStrokes, {
          duration: 1.1,
          opacity: 0.15,
          strokeDashoffset: 1,
          stagger: 0.05,
        }, puzzleStart)
        .to(circle, { duration: 1.15, ease: "power2.inOut", x: 85, scale: 0.36 }, puzzleStart)
        .to(square, { duration: 1.15, ease: "power2.inOut", x: -101, scale: 0.36 }, puzzleStart)
        .to(ground, { duration: 0.75, opacity: 0, strokeDashoffset: 1 }, puzzleStart)
        .set(personStrokes, { opacity: 0 }, puzzleStart + 0.2);

      puzzlePieces.forEach((piece, index) => {
        const arrival = puzzleStart + 0.8 + index * 0.42;
        timeline
          .to(piece, {
            duration: 0.72,
            ease: "power3.out",
            opacity: 1,
            x: 0,
            y: 0,
          }, arrival)
          .to(puzzlePaths[index], { duration: 0.62, strokeDashoffset: 0 }, arrival)
          .to(puzzleLabels[index], { duration: 0.22, opacity: 1 }, arrival + 0.38);
      });

      const labelsGone = puzzleStart + 3.05;
      timeline
        .to(puzzleLabels, { duration: 0.45, opacity: 0, stagger: 0.04 }, labelsGone)
        .to(puzzlePieces[0], { duration: 0.42, x: -10, y: -10 }, labelsGone + 0.55)
        .to(puzzlePieces[1], { duration: 0.42, x: 10, y: -10 }, labelsGone + 0.55)
        .to(puzzlePieces[2], { duration: 0.42, x: -10, y: 10 }, labelsGone + 0.55)
        .to(puzzlePieces[3], { duration: 0.42, x: 10, y: 10 }, labelsGone + 0.55)
        .to(puzzlePieces, {
          duration: 0.68,
          ease: "power3.inOut",
          x: 0,
          y: 0,
        }, labelsGone + 1.05);
    }, root);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [scrollRef]);

  return (
    <aside className="post-team-visual" ref={rootRef} aria-hidden="true">
      <svg className="post-team-svg" viewBox="0 0 480 480" role="presentation">
        <g className="post-person-source">
          <path className="post-person-stroke" pathLength="1" d="M258 132a18 18 0 1 1-36 0 18 18 0 1 1 36 0" />
          <path className="post-person-stroke" pathLength="1" d="M208 181c0-24 14-36 32-36s32 12 32 36" />
          <path className="post-person-stroke" pathLength="1" d="M167 291a18 18 0 1 1-36 0 18 18 0 1 1 36 0" />
          <path className="post-person-stroke" pathLength="1" d="M117 340c0-24 14-36 32-36s32 12 32 36" />
          <path className="post-person-stroke" pathLength="1" d="M349 291a18 18 0 1 1-36 0 18 18 0 1 1 36 0" />
          <path className="post-person-stroke" pathLength="1" d="M299 340c0-24 14-36 32-36s32 12 32 36" />
        </g>

        <g className="segmented-circle">
          <path className="post-shape-stroke" pathLength="1" d="M155 216a49 49 0 0 1 47 62" />
          <path className="post-shape-stroke" pathLength="1" d="M198 291a49 49 0 0 1-86 0" />
          <path className="post-shape-stroke" pathLength="1" d="M108 278a49 49 0 0 1 33-60" />
        </g>

        <g className="outlined-square">
          <path className="post-shape-stroke" pathLength="1" d="M292 314V216H390" />
          <path className="post-shape-stroke" pathLength="1" d="M390 216V314" />
          <path className="post-shape-stroke" pathLength="1" d="M390 314H292" />
        </g>

        <path className="post-ground-line" pathLength="1" d="M54 314H438" />

        <g className="puzzle-piece puzzle-piece-1">
          <path pathLength="1" d="M168 178H240V205c12 0 12 18 0 18v27h-27c0-12-18-12-18 0h-27Z" />
        </g>
        <g className="puzzle-piece puzzle-piece-2">
          <path pathLength="1" d="M240 178H312V250h-27c0 12-18 12-18 0h-27v-27c12 0 12-18 0-18Z" />
        </g>
        <g className="puzzle-piece puzzle-piece-3">
          <path pathLength="1" d="M168 250h27c0-12 18-12 18 0h27v27c-12 0-12 18 0 18v27h-72Z" />
        </g>
        <g className="puzzle-piece puzzle-piece-4">
          <path pathLength="1" d="M240 250h27c0 12 18 12 18 0h27v72h-72v-27c-12 0-12-18 0-18Z" />
        </g>

        <text className="puzzle-label" x="158" y="165">Traction</text>
        <text className="puzzle-label" x="286" y="165">Market</text>
        <text className="puzzle-label" x="158" y="340">Timing</text>
        <text className="puzzle-label" x="274" y="340">Business Model</text>
      </svg>
    </aside>
  );
}
