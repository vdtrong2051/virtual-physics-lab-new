import {
  Suspense,
} from "react";

import {
  Navigate,
  useParams,
} from "react-router";

import {
  experimentModules,
} from "./modules";

import type {
  ExperimentModuleSlug,
} from "./modules";

function isExperimentModuleSlug(
  slug: string,
): slug is ExperimentModuleSlug {
  return slug in experimentModules;
}

export default function ExperimentRoute() {
  const { slug } = useParams();

  if (
    !slug ||
    !isExperimentModuleSlug(slug)
  ) {
    return (
      <Navigate
        to="/app/experiments"
        replace
      />
    );
  }

  const ExperimentComponent =
    experimentModules[slug];

  return (
    <Suspense
      fallback={
        <div>
          Đang tải thí nghiệm...
        </div>
      }
    >
      <ExperimentComponent />
    </Suspense>
  );
}