import type { HarmonicAssessmentQuestion, HarmonicPhaseDefinition, HarmonicPhaseId, HarmonicRuntimeState } from "./model";

export const harmonicPhases: readonly HarmonicPhaseDefinition[] = [
  { id: "intro", label: "1. Giới thiệu", title: "Dao động điều hòa & chuyển động tròn đều" },
  { id: "prep", label: "2. Chuẩn bị", title: "Dụng cụ thực hành" },
  { id: "prac", label: "3. Thực hành", title: "Quan sát hình chiếu" },
  { id: "conc", label: "4. Kết luận", title: "Mối liên hệ vật lí" },
  { id: "test", label: "5. Luyện tập", title: "Kiểm tra kiến thức" },
  { id: "report", label: "6. Báo cáo", title: "Báo cáo thực hành" },
];
export const harmonicPhaseOrder: readonly HarmonicPhaseId[] = harmonicPhases.map((phase) => phase.id);
export const harmonicEquipment = [
  { icon: "⚙️", name: "Mô-tơ điện quay chậm", description: "Tạo chuyển động tròn đều cho vật hình trụ." },
  { icon: "📏", name: "Thanh quay & Vật hình trụ", description: "Đóng vai trò là điểm M chuyển động trên quỹ đạo tròn." },
  { icon: "💡", name: "Đèn chiếu sáng (Nguồn sáng song song)", description: "Tạo bóng (hình chiếu Q) của vật hình trụ lên màn." },
  { icon: "🌀", name: "Con lắc lò xo", description: "Dao động điều hòa theo phương thẳng đứng." },
  { icon: "📺", name: "Màn chắn", description: "Dùng để hứng bóng của vật hình trụ và quả nặng con lắc." },
] as const;
export const harmonicQuestions: readonly HarmonicAssessmentQuestion[] = [
  { id: "q1", prompt: "Biên độ của dao động điều hòa có độ lớn bằng đại lượng nào của chuyển động tròn đều tương ứng?", options: ["A. Đường kính quỹ đạo", "B. Bán kính quỹ đạo", "C. Chu kì quay", "D. Tốc độ dài"], correctOption: 1, explanation: "Hình chiếu của điểm M quét qua một đoạn thẳng có độ dài 2R. Dao động điều hòa quét qua đoạn thẳng dài 2A. Do đó biên độ A = bán kính R." },
  { id: "q2", prompt: "Khi vật chuyển động tròn đều đi qua vị trí xa nguồn sáng nhất hoặc gần nguồn sáng nhất (song song với trục chiếu), bóng của nó trên màn ảnh có vận tốc bằng bao nhiêu?", options: ["A. Cực đại", "B. Bằng 0", "C. Bằng tốc độ dài của vật", "D. Không xác định được"], correctOption: 1, explanation: "Vị trí này tương ứng với hình chiếu đang ở biên. Tại biên, vật dao động điều hòa đổi chiều chuyển động nên vận tốc tức thời bằng 0." },
];
export const createHarmonicRuntime = (): HarmonicRuntimeState => ({ isPlaying: false, speed: 1.5, amplitude: 2.5, showRays: true });
