import Button from "../../../components/ui/Button";

import DampedMath from "./DampedMath";

type DampedConclusionPhaseProps = {
  onBack: () => void;
  onContinue: () => void;
};

export default function DampedConclusionPhase({
  onBack,
  onContinue,
}: DampedConclusionPhaseProps) {
  return (
    <div className="damped-content-phase damped-conclusion">
      <article className="damped-conclusion__card">
        <span className="damped-content-phase__badge">
          Phần 4 · Kết luận
        </span>

        <h2>Kết luận</h2>

        <div className="damped-conclusion__summary">
          <p>
            Thông qua vết mực được vẽ lại trên mặt
            giấy cuộn, ta có thể rút ra 3 kết luận
            cốt lõi về{
            " "
            }
            <strong>Dao động tắt dần</strong>:
          </p>

          <ul>
            <li>
              <strong>Biên độ giảm dần:</strong>{
              " "
              }
              Lực cản của môi trường (không khí)
              và ma sát tại điểm treo, mũi bút đã
              sinh công âm, triệt tiêu dần năng
              lượng của hệ.
            </li>

            <li>
              <strong>
                Chuyển hóa năng lượng:
              </strong>{
              " "
              }
              Cơ năng của hệ không biến mất mà{
              " "
              }
              <DampedMath math="W" /> chuyển hóa
              dần thành nhiệt năng làm nóng môi
              trường xung quanh.
            </li>

            <li>
              <strong>
                Tính đẳng thời (Gần đúng):
              </strong>{
              " "
              }
              Nếu lực cản nhỏ, chu kì dao động{
              " "
              }
              <DampedMath math="T" /> hầu như
              không đổi (khoảng cách giữa 2 đỉnh
              sóng mực liên tiếp trên giấy là bằng
              nhau).
            </li>
          </ul>
        </div>

        <div className="damped-phase-actions">
          <Button
            type="button"
            className="damped-button damped-button--secondary"
            onClick={onBack}
          >
            ← Xem lại hình ảnh
          </Button>

          <Button
            type="button"
            className="damped-button damped-button--primary"
            onClick={onContinue}
          >
            Làm bài Luyện tập →
          </Button>
        </div>
      </article>
    </div>
  );
}
