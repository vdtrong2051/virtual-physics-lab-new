import type {
  DampedAssessmentQuestion,
  DampedPhaseDefinition,
  DampedPhaseId,
} from "./model";

export const dampedPhases: readonly DampedPhaseDefinition[] = [
  {
    id: "intro",
    label: "1. Giới thiệu",
    title: "Dao động tắt dần",
    description:
      "Tìm hiểu sự suy giảm biên độ và quá trình chuyển hóa cơ năng trong dao động tắt dần.",
  },
  {
    id: "prep",
    label: "2. Chuẩn bị",
    title: "Dụng cụ thực hành",
    description:
      "Nhận biết con lắc, bút dạ, băng giấy và bộ phận cuộn giấy dùng để ghi lại dao động.",
  },
  {
    id: "prac",
    label: "3. Thực hành",
    title: "Khảo sát dao động tắt dần",
    description:
      "Điều chỉnh lực cản và tốc độ cuộn giấy, quan sát vệt dao động rồi lưu ảnh để đối chiếu.",
  },
  {
    id: "conc",
    label: "4. Kết luận",
    title: "Phân tích hiện tượng",
    description:
      "Rút ra nhận xét về biên độ, cơ năng và chu kì từ vệt mực trên băng giấy.",
  },
  {
    id: "test",
    label: "5. Luyện tập",
    title: "Kiểm tra kiến thức",
    description:
      "Trả lời câu hỏi về nguyên nhân và các đại lượng biến đổi trong dao động tắt dần.",
  },
  {
    id: "report",
    label: "6. Báo cáo",
    title: "Báo cáo thực hành",
    description:
      "Hoàn thiện phiếu báo cáo A4 về đồ thị, nguyên lí vật lí và ứng dụng của dao động tắt dần.",
  },
];

export const dampedPhaseOrder: readonly DampedPhaseId[] =
  dampedPhases.map((phase) => phase.id);

export const dampedInitialPhaseId: DampedPhaseId = "intro";

export const dampedPhysicsConfig = {
  amplitude: 3,
  angularFrequency: 5,
  pendulumLength: 7.94,
  graphMaxTime: 12,
  graphSteps: 300,
  maxTracePoints: 10_000,
  dampingMin: 0.05,
  dampingMax: 0.4,
  dampingStep: 0.01,
  dampingDefault: 0.12,
  paperSpeedMin: 1,
  paperSpeedMax: 6,
  paperSpeedStep: 0.5,
  paperSpeedDefault: 3.5,
  snapshotLimit: 2,
} as const;

export const dampedEquipment = [
  {
    icon: "⚖️",
    name: "Con lắc lò xo / Con lắc đơn",
    description:
      "Có gắn một quả nặng để thực hiện dao động.",
  },
  {
    icon: "🖋️",
    name: "Bút dạ (Marker)",
    description:
      "Gắn chặt vào phần dưới của quả nặng để ghi lại quỹ đạo.",
  },
  {
    icon: "📜",
    name: "Tấm nhựa / Băng giấy dài",
    description:
      "Nơi bút dạ tì lên để vẽ ra đồ thị li độ - thời gian.",
  },
  {
    icon: "⚙️",
    name: "Bộ phận cuộn giấy",
    description:
      "Động cơ kéo tấm giấy chuyển động với vận tốc không đổi (v).",
  },
] as const;

export const dampedAssessmentQuestions: readonly DampedAssessmentQuestion[] = [
  {
    id: "q1",
    prompt:
      "Nguyên nhân chủ yếu làm cho dao động của con lắc trong thí nghiệm bị tắt dần là gì?",
    options: [
      "A. Do lực cản của môi trường và lực ma sát.",
      "B. Do trọng lực tác dụng lên vật.",
      "C. Do lực căng của sợi dây đứt dần.",
      "D. Do động năng chuyển hóa thành thế năng.",
    ],
    correctOption: 0,
    explanation:
      "Lực ma sát ở điểm treo và ma sát giữa bút dạ với giấy, cùng lực cản không khí thực hiện công âm làm cơ năng giảm dần.",
  },
  {
    id: "q2",
    prompt:
      "Trong quá trình dao động tắt dần, đại lượng nào sau đây giảm liên tục theo thời gian?",
    options: [
      "A. Chu kì dao động.",
      "B. Tần số dao động.",
      "C. Biên độ và Cơ năng.",
      "D. Động năng và Thế năng.",
    ],
    correctOption: 2,
    explanation:
      "Biên độ giảm dần do cơ năng tiêu hao (chuyển hóa thành nhiệt năng). Động năng và thế năng thì tăng giảm tuần hoàn chứ không giảm liên tục.",
  },
];
