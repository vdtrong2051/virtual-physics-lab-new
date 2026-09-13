import type {
  BoyleAssessmentQuestion,
  BoyleObservationId,
  BoylePhaseDefinition,
  BoylePhaseId,
  BoylePreparationToolDefinition,
} from "./model";

export const boylePhases: readonly BoylePhaseDefinition[] = [
  {
    id: "intro",
    label: "1. Giới thiệu",
    title: "Định luật Boyle-Mariotte",
    description:
      "Tìm hiểu mối liên hệ giữa áp suất và thể tích của một lượng khí xác định trong quá trình đẳng nhiệt.",
  },
  {
    id: "prep",
    label: "2. Chuẩn bị",
    title: "Chuẩn bị dụng cụ",
    description:
      "Lựa chọn đúng các thiết bị cần thiết để tiến hành thí nghiệm khảo sát định luật Boyle-Mariotte.",
  },
  {
    id: "prac",
    label: "3. Thực hành",
    title: "Khảo sát quá trình đẳng nhiệt",
    description:
      "Thay đổi thể tích khí, quan sát áp suất và thu thập số liệu khi hệ đã đạt trạng thái cân bằng.",
  },
  {
    id: "conc",
    label: "4. Kết luận",
    title: "Phân tích kết quả",
    description:
      "Sử dụng số liệu đã đo để nhận xét mối liên hệ giữa áp suất và thể tích.",
  },
  {
    id: "test",
    label: "5. Luyện tập",
    title: "Kiểm tra kiến thức",
    description:
      "Trả lời các câu hỏi về định luật Boyle-Mariotte và hiện tượng quan sát được trong thí nghiệm.",
  },
  {
    id: "report",
    label: "6. Báo cáo",
    title: "Báo cáo thực hành",
    description:
      "Đối chiếu dữ liệu đã thu thập và sử dụng phiếu thực hành để hoàn thành báo cáo.",
  },
];

export const boylePhaseOrder: readonly BoylePhaseId[] =
  boylePhases.map((phase) => phase.id);

export const boyleInitialPhaseId: BoylePhaseId = "intro";

export const boylePhysicsConfig = {
  volumeMin: 1.5,
  volumeMax: 3.0,
  boyleConstant: 3.0,

  duplicateVolumeTolerance: 0.1,

  targetMeasurementCount: 5,
} as const;

export const boyleUnits = {
  volume: "cm³",
  pressure: "10⁵ Pa",
  pressureVolume: "10⁵ Pa·cm³",
  inverseVolume: "cm⁻³",
  temperature: "°C",
} as const;

export const boylePreparationTools: readonly BoylePreparationToolDefinition[] =
  [
    {
      id: "set_boyle",
      name: "Bộ thiết bị khảo sát định luật Boyle",
      icon: "🧪",
      correct: true,
    },
    {
      id: "stand",
      name: "Giá đỡ kim loại và trụ inox",
      icon: "⚗️",
      correct: true,
    },
    {
      id: "clamp",
      name: "Ngàm kẹp và núm vặn cố định",
      icon: "🔧",
      correct: true,
    },
    {
      id: "calorimeter",
      name: "Nhiệt lượng kế điện tử",
      icon: "⚡",
      correct: false,
    },
    {
      id: "balance",
      name: "Cân phân tích điện tử",
      icon: "⚖️",
      correct: false,
    },
    {
      id: "flask",
      name: "Bình cầu đáy tròn chịu nhiệt",
      icon: "🌡️",
      correct: false,
    },
  ];

export const boyleIntroContent = {
  isothermalProcess: {
    title: "Quá trình đẳng nhiệt",
    description:
      "Quá trình biến đổi trạng thái trong đó nhiệt độ được giữ không đổi gọi là quá trình đẳng nhiệt. Trong thực tế, quá trình nén hoặc giãn khí cần được thực hiện đủ chậm để khối khí có thời gian trao đổi nhiệt với môi trường.",
  },

  graph: {
    title: "Đồ thị biến thiên",
    description:
      "Trong hệ tọa độ (p, V), đường biểu diễn sự biến thiên của áp suất theo thể tích trong quá trình đẳng nhiệt có dạng đường hypebol.",
  },

  formula: "p · V = const",
} as const;

export const boylePracticeInstructions = [
  "Nén hoặc giãn khối khí từ từ để hệ có thời gian trở lại trạng thái cân bằng đẳng nhiệt.",
  "Chỉ ghi số liệu khi hệ đã ổn định.",
  "Thu thập số liệu tại 5 mức thể tích khác nhau.",
  "Quan sát đồng thời thể tích, áp suất, đồ thị và chuyển động vi mô của các phân tử khí.",
] as const;

export const boyleObservationPrompts: readonly {
  id: BoyleObservationId;
  prompt: string;
}[] = [
  {
    id: "pressure-volume-relationship",
    prompt:
      "Từ số liệu và đồ thị thu được, hãy nhận xét mối liên hệ giữa áp suất p và thể tích V.",
  },
  {
    id: "microscopic-explanation",
    prompt:
      "Khi giảm thể tích khối khí, hãy giải thích ở mức độ vi mô vì sao áp suất tăng.",
  },
];

export const boyleAssessmentQuestions: readonly BoyleAssessmentQuestion[] = [
  {
    id: "q1",
    prompt:
      "Trong hệ tọa độ (p, V), đường đẳng nhiệt có dạng hình học nào dưới đây?",
    options: [
      "A. Một đường thẳng đi qua gốc tọa độ",
      "B. Một đường hypebol",
      "C. Một đường parabol",
      "D. Một đường cong bậc ba",
    ],
    correctOption: 1,
  },
  {
    id: "q2",
    prompt:
      "Nguyên nhân vật lý cốt lõi làm tăng áp suất khi nén khí đẳng nhiệt là gì?",
    options: [
      "A. Kích thước phân tử khí tăng lên",
      "B. Mật độ phân tử khí tăng, tần suất va chạm vào thành bình tăng",
      "C. Động năng phân tử tăng do nhiệt lượng truyền vào",
      "D. Lực hút giữa các phân tử khí mạnh lên",
    ],
    correctOption: 1,
  },
  {
    id: "q3",
    prompt:
      "Để định luật Boyle-Mariotte nghiệm đúng, đại lượng nào sau đây phải được giữ không đổi?",
    options: [
      "A. Áp suất và thể tích",
      "B. Nhiệt độ và áp suất",
      "C. Nhiệt độ và khối lượng khí",
      "D. Thể tích và khối lượng khí",
    ],
    correctOption: 2,
  },
  {
    id: "q4",
    prompt:
      "Một khối khí có thể tích ban đầu 3,0 cm³. Nếu nén đẳng nhiệt xuống còn 1,5 cm³ thì áp suất thay đổi như thế nào?",
    options: [
      "A. Tăng lên gấp đôi",
      "B. Giảm đi một nửa",
      "C. Tăng lên gấp bốn lần",
      "D. Không thay đổi",
    ],
    correctOption: 0,
  },
];