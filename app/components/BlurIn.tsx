"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type BlurInProps = {
  children: ReactNode;
  className?: string;
};

export function BlurIn({ children, className }: BlurInProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { filter: "blur(10px)", opacity: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
