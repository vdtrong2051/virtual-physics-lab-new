import {
  lazy,
} from "react";

export const experimentModules = {
  boyle: lazy(
    () => import("./boyle"),
  ),

  joule: lazy(
    () => import("./joule"),
  ),

  "damped-oscillation": lazy(
    () =>
      import(
        "./DampedOscillation"
      ),
  ),

  "forced-resonance": lazy(
    () =>
      import(
        "./ForcedResonance"
      ),
  ),

  "harmonic-motion": lazy(
    () =>
      import(
        "./HarmonicMotion"
      ),
  ),
} as const;

export type ExperimentModuleSlug =
  keyof typeof experimentModules;