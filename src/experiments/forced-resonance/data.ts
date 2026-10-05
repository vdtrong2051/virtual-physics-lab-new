import type {
  ForcedAssessmentQuestion,
  ForcedPhaseDefinition,
  ForcedPhaseId,
  ForcedRuntimeState,
} from "./model";

export const forcedPhases: readonly ForcedPhaseDefinition[] = [
  { id: "intro", label: "1. Giới thiệu", title: "Dao động cưỡng bức & cộng hưởng" },
  { id: "prep", label: "2. Chuẩn bị", title: "Dụng cụ thực hành" },
  { id: "prac", label: "3. Thực hành", title: "Khảo sát cộng hưởng" },
  { id: "conc", label: "4. Kết luận", title: "Phân tích hiện tượng" },
  { id: "test", label: "5. Luyện tập", title: "Kiểm tra kiến thức" },
  { id: "report", label: "6. Báo cáo", title: "Báo cáo thực hành" },
];

export const forcedPhaseOrder: readonly ForcedPhaseId[] =
  forcedPhases.map((phase) => phase.id);

export const forcedEquipment = [
  { icon: "🏗️", name: "Giá đỡ & Thanh ngang", description: "Thanh cứng hình trụ có thể xoay nhẹ quanh trục để truyền năng lượng giữa các con lắc." },
  { icon: "🔴", name: "Con lắc điều khiển (Đ)", description: "Con lắc có khối lượng lớn nhất, đóng vai trò tạo ra ngoại lực tuần hoàn." },
  { icon: "🔵", name: "Các con lắc thử (1, 2, 3)", description: "Các con lắc có khối lượng nhỏ hơn và chiều dài khác nhau, đóng vai trò hệ chịu lực cưỡng bức." },
] as const;

export const forcedQuestions: readonly ForcedAssessmentQuestion[] = [
  {
    id: "q1",
    prompt: "Hiện tượng cộng hưởng cơ xảy ra khi nào?",
    options: [
      "A. Lực cản của môi trường rất nhỏ.",
      "B. Tần số của ngoại lực cưỡng bức bằng tần số riêng của hệ.",
      "C. Biên độ của ngoại lực cưỡng bức đạt giá trị cực đại.",
      "D. Hệ dao động không chịu tác dụng của lực ma sát.",
    ],
    correctOption: 1,
    explanation: "Điều kiện tiên quyết để xảy ra hiện tượng cộng hưởng (biên độ tăng vọt lên cực đại) là f = f₀.",
  },
  {
    id: "q2",
    prompt: "Biết công thức tính tần số riêng của con lắc đơn là f₀ = (1/2π)·√(g/l). Để một con lắc đơn dài 1 m bị cộng hưởng, ngoại lực cưỡng bức phải có chu kì T xấp xỉ bằng bao nhiêu? (Lấy g = π²)",
    options: ["A. 1 giây", "B. 2 giây", "C. 3,14 giây", "D. 0,5 giây"],
    correctOption: 1,
    explanation: "Để cộng hưởng thì T ngoại = T riêng = 2π√(l/g). Với g = π² và l = 1 m, ta có T = 2 giây.",
  },
];

export function createForcedRuntime(): ForcedRuntimeState {
  return {
    isPlaying: false,
    resetVersion: 0,
    isCameraLocked: false,
    driver: { length: 5, posX: -3 },
    p1: { length: 3, posX: 0 },
    p2: { length: 5, posX: 3 },
    p3: { length: 7, posX: 6 },
  };
}
