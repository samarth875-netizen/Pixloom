import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion animation variants for Pixloom.
 * - All durations are 200–600ms for snappiness.
 * - useReducedMotion is respected via the `prefersReducedMotion` flag
 *   passed to each component — simply set `initial` and `animate` to
 *   the same values when true.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut", delay },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/** Staggered container: children animate in sequence. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/** Child used inside staggerContainer — fade-up child. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Viewport options reused across all whileInView calls. */
export const viewportOnce = { once: true, margin: "-80px" };
