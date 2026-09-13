import type {
  JouleAssessmentQuestion,
  JoulePhaseDefinition,
  JoulePhaseId,
  JoulePreparationToolDefinition,
} from "./model";

export const joulePhases: readonly JoulePhaseDefinition[] = [
  {
    id: "intro",
    label: "1. Giới thiệu",
    title: "Thí nghiệm Joule",
    description:
      "Tìm hiểu sự chuyển hóa cơ năng thành nhiệt năng và ý nghĩa của đương lượng cơ học của nhiệt.",
  },
  {
    id: "prep",
    label: "2. Chuẩn bị",
    title: "Chuẩn bị dụng cụ",
    description:
      "Lựa chọn đúng các dụng cụ cần thiết để lắp hệ thí nghiệm Joule.",
  },
  {
    id: "prac",
    label: "3. Thực hành",
    title: "Tiến hành thí nghiệm",
    description:
      "Thay đổi khối lượng tạ và độ cao thả, quan sát quá trình chuyển hóa năng lượng và ghi số liệu.",
  },
  {
    id: "conc",
    label: "4. Kết luận",
    title: "Kết luận thí nghiệm",
    description:
      "Đối chiếu kết quả đo với mối liên hệ giữa công cơ học và nhiệt lượng.",
  },
  {
    id: "test",
    label: "5. Luyện tập",
    title: "Kiểm tra kiến thức",
    description:
      "Trả lời các câu hỏi về sự chuyển hóa cơ năng thành nội năng trong thí nghiệm Joule.",
  },
  {
    id: "report",
    label: "6. Báo cáo",
    title: "Báo cáo thực hành",
    description:
      "Sử dụng số liệu đã thu thập để hoàn thành phiếu báo cáo thực hành.",
  },
];

export const joulePhaseOrder: readonly JoulePhaseId[] =
  joulePhases.map((phase) => phase.id);

export const jouleInitialPhaseId: JoulePhaseId =
  "intro";

export const joulePhysicsConfig = {
  gravityMPerS2: 9.8,

  waterMassKg: 1.0,

  // Dùng cho mô phỏng vật lý.
  waterSpecificHeatJPerKgC: 4200,

  // Dùng khi quy đổi nhiệt lượng sang cal.
  waterSpecificHeatCalPerKgC: 1000,

  // Giá trị chuẩn dùng để đối chiếu kết quả.
  standardMechanicalEquivalentJPerCal: 4.18,

  initialTemperatureC: 25,

  massPerSideMinKg: 0.5,
  massPerSideMaxKg: 5.0,
  massPerSideStepKg: 0.5,
  massPerSideDefaultKg: 2.0,

  dropHeightMinM: 0.1,
  dropHeightStepM: 0.1,
  dropHeightDefaultM: 2.0,

  targetMeasurementCount: 5,
} as const;

export const jouleUnits = {
  mass: "kg",
  height: "m",
  work: "J",

  temperature: "°C",
  temperatureRise: "°C",

  heat: "cal",
  mechanicalEquivalent: "J/cal",
  relativeError: "%",
  time: "s",
} as const;

export const joulePreparationTools: readonly JoulePreparationToolDefinition[] =
  [
    {
      id: "stand",
      name: "Khung Giá Đỡ",
      description: "Hệ khung và trục thép",
      icon: "🏗️",
      correct: true,
    },
    {
      id: "calorimeter",
      name: "Bình Nhiệt Lượng",
      description: "Vỏ đồng cách nhiệt xốp",
      icon: "🛢️",
      correct: true,
    },
    {
      id: "water",
      name: "Nước Cất",
      description: "1.0 kg nước nguyên chất",
      icon: "💧",
      correct: true,
    },
    {
      id: "paddle",
      name: "Cánh Khuấy",
      description: "Trục xoay và 6 cánh tản",
      icon: "⚙️",
      correct: true,
    },
    {
      id: "weights",
      name: "Ròng Rọc & Tạ",
      description: "Hệ ròng rọc và tạ xếp",
      icon: "⚖️",
      correct: true,
    },
    {
      id: "burner",
      name: "Đèn Cồn",
      description: "Dụng cụ cung cấp nhiệt",
      icon: "🔥",
      correct: false,
    },
    {
      id: "scale",
      name: "Lực Kế Lò Xo",
      description: "Dụng cụ đo lực kéo",
      icon: "🎚️",
      correct: false,
    },
    {
      id: "beaker",
      name: "Cốc Mỏ (Beaker)",
      description: "Cốc đong thủy tinh",
      icon: "🧪",
      correct: false,
    },
  ];

export const jouleIntroContent = {
  mechanicalToThermalEnergy: {
    title: "Cơ Năng biến thành Nhiệt Năng",
    description:
      "Vào thế kỷ 19, James Prescott Joule đã thiết kế một hệ thống trong đó các quả nặng rơi xuống làm quay một hệ thống cánh khuấy đặt trong một bình nước cách nhiệt. Lực ma sát giữa cánh khuấy và nước khiến nhiệt độ của nước tăng lên.",
  },

  mechanicalEquivalentOfHeat: {
    title: "Đương lượng Cơ học của Nhiệt",
    description:
      "Thí nghiệm này chứng minh rằng nhiệt không phải là một chất lưu vô hình mà thực chất là một dạng truyền năng lượng. Công cơ học do quả nặng thực hiện đã chuyển hóa hoàn toàn thành sự gia tăng nội năng của nước.",
  },

  firstLaw: {
    title: "Định luật 1 Nhiệt Động Lực Học",
    formula: "A = Q",
    experimentFormula:
      "2 · m · g · h = m_nước · c · ΔT",
    description:
      "Nếu hệ cách nhiệt lý tưởng, công cơ học A do hệ hai quả nặng rơi xuống sinh ra sẽ bằng chính xác với nhiệt lượng Q mà khối nước thu vào để tăng nhiệt độ.",
    massNote:
      "Trong công thức trên, m là khối lượng tạ ở mỗi bên.",
  },
} as const;

export const jouleAssessmentQuestions: readonly JouleAssessmentQuestion[] =
  [
    {
      id: "q1",
      prompt:
        "Trong thí nghiệm của Joule, sự chuyển hóa năng lượng chủ yếu diễn ra như thế nào?",
      options: [
        "A. Nội năng chuyển hóa thành Cơ năng",
        "B. Cơ năng chuyển hóa thành Điện năng",
        "C. Cơ năng chuyển hóa thành Nội năng (Nhiệt)",
        "D. Nhiệt năng chuyển hóa thành Động năng",
      ],
      correctOption: 2,
    },
    {
      id: "q2",
      prompt:
        "Biểu thức nào sau đây thể hiện định luật bảo toàn năng lượng trong thí nghiệm Joule (giả sử hệ cách nhiệt tuyệt đối)?",
      options: [
        "A. A > Q",
        "B. A = Q",
        "C. A < Q",
        "D. A + Q = 0",
      ],
      correctOption: 1,
    },
    {
      id: "q3",
      prompt:
        "Hiện tượng nào sau đây là hệ quả của việc chuyển hóa Cơ năng thành Nội năng?",
      options: [
        "A. Nước đá tan ở 0°C",
        "B. Xoa hai bàn tay vào nhau vào mùa đông thấy tay ấm lên",
        "C. Đun sôi nước bằng ấm siêu tốc",
        "D. Mở nắp chai nước hoa thấy mùi thơm",
      ],
      correctOption: 1,
    },
  ];