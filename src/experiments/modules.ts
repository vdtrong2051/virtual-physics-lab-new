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
} as const;

export type ExperimentModuleSlug =
  keyof typeof experimentModules;