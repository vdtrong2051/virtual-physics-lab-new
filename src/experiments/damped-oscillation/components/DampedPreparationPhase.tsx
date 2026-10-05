import Button from "../../../components/ui/Button";

import {
  dampedEquipment,
} from "../data";

type DampedPreparationPhaseProps = {
  onBack: () => void;
  onContinue: () => void;
};

export default function DampedPreparationPhase({
  onBack,
  onContinue,
}: DampedPreparationPhaseProps) {
  return (
    <div className="damped-content-phase damped-preparation">
      <div className="damped-content-phase__inner">
        <span className="damped-content-phase__badge">
          Phần 2 · Chuẩn bị
        </span>

        <h2>Dụng cụ Thực hành</h2>

        <div className="damped-preparation__grid">
          {dampedEquipment.map(
            (item) => (
              <article
                key={item.name}
                className="damped-equipment-card"
              >
                <span
                  className="damped-equipment-card__icon"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>

                <h3>{item.name}</h3>

                <p>{item.description}</p>
              </article>
            ),
          )}
        </div>

        <aside className="damped-preparation__note">
          <h3>💡 Bố trí thí nghiệm:</h3>

          <p>
            Cho con lắc dao động ổn định. Bật
            động cơ kéo tấm giấy chạy ngang với
            tốc độ đều. Đầu bút dạ gắn trên quả
            nặng sẽ liên tục tiếp xúc và quét lên
            mặt giấy, để lại một vệt mực chính là
            đồ thị dao động tắt dần thực tế.
          </p>
        </aside>

        <div className="damped-phase-actions">
          <Button
            type="button"
            className="damped-button damped-button--secondary"
            onClick={onBack}
          >
            ← Quay lại
          </Button>

          <Button
            type="button"
            className="damped-button damped-button--primary"
            onClick={onContinue}
          >
            Vào Phòng Thí nghiệm →
          </Button>
        </div>
      </div>
    </div>
  );
}
