export type ExperimentCurriculum =
  | "ket-noi-tri-thuc";

export type ExperimentDomain =
  | "mechanics"
  | "thermal"
  | "gas"
  | "magnetic"
  | "nuclear";

export type ExperimentGroup =
  | "oscillation"
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

  {
    slug:
      "damped-oscillation",

    title:
      "Dao động tắt dần",

    curriculum:
      "ket-noi-tri-thuc",

    grade: 11,

    domain: "mechanics",
    group: "oscillation",

    topic: "Dao động cơ",

    isFree: true,
    status: "ready",

    description:
      "Khảo sát sự suy giảm biên độ của dao động tắt dần.",
  },

  {
    slug:
      "forced-resonance",

    title:
      "Dao động cưỡng bức & cộng hưởng",

    curriculum:
      "ket-noi-tri-thuc",

    grade: 11,

    domain: "mechanics",
    group: "oscillation",

    topic: "Dao động cơ",

    isFree: true,
    status: "ready",

    description:
      "Khảo sát dao động cưỡng bức và điều kiện xảy ra cộng hưởng.",
  },

  {
    slug:
      "harmonic-motion",

    title:
      "Dao động điều hòa & chuyển động tròn đều",

    curriculum:
      "ket-noi-tri-thuc",

    grade: 11,

    domain: "mechanics",
    group: "oscillation",

    topic: "Dao động cơ",

    isFree: true,
    status: "ready",

    description:
      "Khảo sát mối liên hệ giữa dao động điều hòa và chuyển động tròn đều.",
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