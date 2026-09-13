import type {
  ExperimentPhaseDefinition,
  ExperimentPhaseId,
} from "./model";

export const experimentPhases: ExperimentPhaseDefinition<ExperimentPhaseId>[] = [
  {
    id: "intro",
    label: "1. Giới thiệu",
    title: "Giới thiệu",
    description:
      "Khung giới thiệu sẽ được thay bằng nội dung của từng thí nghiệm.",
  },
  {
    id: "preparation",
    label: "2. Chuẩn bị",
    title: "Chuẩn bị",
    description:
      "Khung chuẩn bị sẽ được thay bằng yêu cầu và dụng cụ của từng thí nghiệm.",
  },
  {
    id: "experiment",
    label: "3. Thực hành",
    title: "Thực hành",
    description:
      "Workspace thực nghiệm sẽ được gắn bởi module thí nghiệm cụ thể.",
  },
  {
    id: "conclusion",
    label: "4. Kết luận",
    title: "Kết luận",
    description:
      "Khung kết luận sẽ được thay bằng phần tổng hợp của từng thí nghiệm.",
  },
  {
    id: "practice",
    label: "5. Luyện tập",
    title: "Luyện tập",
    description:
      "Khung luyện tập sẽ được thay bằng hoạt động củng cố của từng thí nghiệm.",
  },
  {
    id: "report",
    label: "6. Báo cáo",
    title: "Báo cáo",
    description:
      "Khung báo cáo sẽ được thay bằng biểu mẫu hoặc quy trình báo cáo riêng.",
  },
];

export const experimentPhaseOrder: ExperimentPhaseId[] =
  experimentPhases.map((phase) => phase.id);

export const initialPhaseId: ExperimentPhaseId = "intro";

export function getExperimentPhase(phaseId: ExperimentPhaseId) {
  return experimentPhases.find((phase) => phase.id === phaseId);
}
