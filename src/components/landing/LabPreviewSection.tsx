import { useState } from "react";

const previewSteps = [
  {
    id: "prepare",
    number: "01",
    label: "Chuẩn bị",
    title: "Hiểu mục tiêu và dụng cụ trước khi bắt đầu",
    description:
      "Người học xem mục tiêu bài thực hành, các dụng cụ cần sử dụng và những đại lượng sẽ được quan sát hoặc đo.",
    points: [
      "Mục tiêu thí nghiệm",
      "Dụng cụ và thiết bị",
      "Các đại lượng cần theo dõi",
    ],
  },
  {
    id: "operate",
    number: "02",
    label: "Thao tác",
    title: "Tương tác trực tiếp với mô hình thí nghiệm",
    description:
      "Người học điều chỉnh thiết bị, thay đổi thông số và quan sát hiện tượng vật lý thay đổi theo thao tác.",
    points: [
      "Điều chỉnh thông số",
      "Tương tác với thiết bị",
      "Quan sát hiện tượng",
    ],
  },
  {
    id: "measure",
    number: "03",
    label: "Đo số liệu",
    title: "Thu thập và ghi lại số liệu thực nghiệm",
    description:
      "Các giá trị đo được ghi vào bảng để người học theo dõi sự thay đổi và chuẩn bị cho bước xử lý kết quả.",
    points: [
      "Đọc giá trị đo",
      "Ghi bảng số liệu",
      "Theo dõi biến thiên",
    ],
  },
  {
    id: "result",
    number: "04",
    label: "Kết quả",
    title: "Phân tích và hoàn thành bài thực hành",
    description:
      "Người học xử lý số liệu, xem biểu đồ hoặc kết quả tính toán, sau đó hoàn thành phần kết luận và câu hỏi.",
    points: [
      "Xử lý số liệu",
      "Phân tích kết quả",
      "Kết luận và bài tập",
    ],
  },
];

export default function LabPreviewSection() {
  const [activeStepId, setActiveStepId] = useState("prepare");

  const activeStep =
    previewSteps.find((step) => step.id === activeStepId) ??
    previewSteps[0];

  return (
    <section
      id="lab-preview"
      className="landing-lab-preview"
    >
      <div className="landing-lab-preview__inner">

        {/* Tiêu đề */}
        <div className="landing-lab-preview__header">
          <p className="landing-lab-preview__eyebrow">
            TRẢI NGHIỆM PHÒNG THÍ NGHIỆM
          </p>

          <h2 className="landing-lab-preview__title">
            Một bài thực hành diễn ra như thế nào?
          </h2>

          <p className="landing-lab-preview__description">
            Mỗi bài được tổ chức thành một quy trình rõ ràng,
            từ chuẩn bị đến thao tác, đo đạc và phân tích kết quả.
          </p>
        </div>

        {/* Các bước */}
        <div className="landing-lab-preview__steps">
          {previewSteps.map((step) => {
            const isActive = step.id === activeStep.id;

            return (
              <button
                key={step.id}
                type="button"
                className={`landing-lab-preview__step ${
                  isActive
                    ? "landing-lab-preview__step--active"
                    : ""
                }`}
                onClick={() => setActiveStepId(step.id)}
              >
                <span className="landing-lab-preview__step-number">
                  {step.number}
                </span>

                <span className="landing-lab-preview__step-label">
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Nội dung bước đang chọn */}
        <div className="landing-lab-preview__content">

          <div className="landing-lab-preview__info">
            <span className="landing-lab-preview__current-step">
              Bước {activeStep.number}
            </span>

            <h3>{activeStep.title}</h3>

            <p>{activeStep.description}</p>

            <ul>
              {activeStep.points.map((point) => (
                <li key={point}>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Preview bên phải */}
          <div className="landing-lab-preview__visual">
            <div className="landing-lab-preview__window">

              <div className="landing-lab-preview__window-header">
                <div>
                  <span />
                  <span />
                  <span />
                </div>

                <strong>
                  {activeStep.label}
                </strong>
              </div>

              <div className="landing-lab-preview__window-body">
                <div className="landing-lab-preview__scene">
                  Preview giao diện:
                  {" "}
                  {activeStep.label}
                </div>

                <div className="landing-lab-preview__panel">
                  <span>
                    Nội dung giao diện lab thật sẽ được đặt tại đây.
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}