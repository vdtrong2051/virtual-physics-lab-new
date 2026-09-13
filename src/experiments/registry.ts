export type ExperimentStatus =
  | "ready"
  | "planned";

export type ExperimentItem = {
  slug: string;
  title: string;
  grade: 10 | 11 | 12;
  topic: string;
  isFree: boolean;
  status: ExperimentStatus;
  description?: string;
};

export const experiments: ExperimentItem[] = [
  {
    slug: "boyle",
    title: "Định luật Boyle",
    grade: 12,
    topic: "Chất khí",
    isFree: true,
    status: "ready",
    description:
      "Khảo sát mối quan hệ giữa áp suất và thể tích.",
  },
  {
    slug: "joule",
    title: "Thí nghiệm Joule",
    grade: 12,
    topic: "Nhiệt học",
    isFree: false,
    status: "ready",
    description:
      "Khảo sát sự chuyển hóa cơ năng thành nhiệt năng.",
  },
  {
    slug: "brownian",
    title: "Chuyển động Brown",
    grade: 12,
    topic: "Cấu tạo chất",
    isFree: true,
    status: "planned",
  },
];

export function getExperimentBySlug(slug: string) {
  return experiments.find(
    (experiment) => experiment.slug === slug
  );
}