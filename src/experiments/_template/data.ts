import type {
  ExperimentPhaseDefinition,
  ExperimentPhaseId,
} from "./model";

export const experimentPhases:
  ExperimentPhaseDefinition<ExperimentPhaseId>[] = [
    {
      id: "intro",
      label: "1. Giới thiệu",
      title: "Giới thiệu",
      description:
        "Trình bày mục tiêu, hiện tượng vật lý và kiến thức nền của thí nghiệm.",
    },
    {
      id: "prep",
      label: "2. Chuẩn bị",
      title: "Chuẩn bị",
      description:
        "Lựa chọn, kiểm tra hoặc lắp ráp các dụng cụ cần thiết trước khi thực hành.",
    },
    {
      id: "prac",
      label: "3. Thực hành",
      title: "Thực hành",
      description:
        "Thực hiện tương tác chính, quan sát hiện tượng và thu thập dữ liệu đo.",
    },
    {
      id: "conc",
      label: "4. Kết luận",
      title: "Kết luận",
      description:
        "Phân tích kết quả, ghi nhận quan sát và rút ra kết luận vật lý.",
    },
    {
      id: "test",
      label: "5. Luyện tập",
      title: "Luyện tập",
      description:
        "Trả lời câu hỏi kiểm tra hoặc thực hiện hoạt động củng cố sau thí nghiệm.",
    },
    {
      id: "report",
      label: "6. Báo cáo",
      title: "Báo cáo",
      description:
        "Đối chiếu dữ liệu đã thu thập và hoàn thành báo cáo hoặc phiếu thực hành.",
    },
  ];

export const experimentPhaseOrder:
  ExperimentPhaseId[] =
    experimentPhases.map(
      (phase) => phase.id,
    );

export const initialPhaseId:
  ExperimentPhaseId =
    "intro";

export function getExperimentPhase(
  phaseId: ExperimentPhaseId,
) {
  return experimentPhases.find(
    (phase) =>
      phase.id === phaseId,
  );
}