export type ExperimentCurriculum =
  | "ket-noi-tri-thuc";

export type ExperimentDomain =
  | "thermal"
  | "gas"
  | "magnetic"
  | "nuclear";

export type ExperimentGroup =
  | "matter-structure"
  | "thermodynamics"
  | "ideal-gas"
  | "magnetism"
  | "nuclear-physics";

export type ExperimentStatus =
  | "ready"
  | "planned";

export type ExperimentItem = {
  slug: string;
  title: string;

  curriculum:
    ExperimentCurriculum;

  grade: 10 | 11 | 12;

  domain:
    ExperimentDomain;

  group:
    ExperimentGroup;

  topic: string;

  isFree: boolean;

  status:
    ExperimentStatus;

  description?: string;
};

export const experiments:
  ExperimentItem[] = [
  {
    slug: "boyle",
    title: "Định luật Boyle",

    curriculum:
      "ket-noi-tri-thuc",

    grade: 12,

    domain: "gas",
    group: "ideal-gas",

    topic: "Chất khí",

    isFree: true,
    status: "ready",

    description:
      "Khảo sát mối quan hệ giữa áp suất và thể tích.",
  },

  {
    slug: "joule",
    title: "Thí nghiệm Joule",

    curriculum:
      "ket-noi-tri-thuc",

    grade: 12,

    domain: "thermal",
    group: "thermodynamics",

    topic: "Nhiệt học",

    isFree: false,
    status: "ready",

    description:
      "Khảo sát sự chuyển hóa cơ năng thành nhiệt năng.",
  },

  {
    slug: "brownian",
    title: "Chuyển động Brown",

    curriculum:
      "ket-noi-tri-thuc",

    grade: 12,

    domain: "thermal",
    group: "matter-structure",

    topic: "Cấu tạo chất",

    isFree: true,
    status: "planned",
  },
];

export function getExperimentBySlug(
  slug: string,
) {
  return experiments.find(
    (experiment) =>
      experiment.slug === slug,
  );
}