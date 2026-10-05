import Button from "../../../components/ui/Button";

import DampedMath from "./DampedMath";

type DampedIntroPhaseProps = {
  onContinue: () => void;
};

export default function DampedIntroPhase({
  onContinue,
}: DampedIntroPhaseProps) {
  return (
    <div className="damped-intro">
      <div
        className="damped-intro__grid-bg"
        aria-hidden="true"
      />

      <div
        className="damped-intro__glow damped-intro__glow--rose"
        aria-hidden="true"
      />

      <div
        className="damped-intro__glow damped-intro__glow--fuchsia"
        aria-hidden="true"
      />

      <div className="damped-intro__content">
        <header className="damped-intro__heading">
          <span className="damped-intro__badge">
            <span aria-hidden="true" />
            Chuyên đề Dao động cơ
          </span>

          <h2>
            Khảo sát Hiện tượng
            <strong>
              Dao Động Tắt Dần
            </strong>
          </h2>
        </header>

        <div className="damped-intro__cards">
          <article className="damped-intro-card">
            <span className="damped-intro-card__icon damped-intro-card__icon--rose">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </span>

            <h3>
              Sự biến thiên Biên độ
            </h3>

            <p>
              Trong thực tế, không có dao động
              nào duy trì mãi mãi. Khi kéo một
              con lắc ra khỏi vị trí cân bằng rồi
              thả tự do, ta sẽ quan sát thấy{
              " "
              }
              <strong>
                biên độ của nó giảm liên tục theo
                thời gian
              </strong>
              . Dao động như vậy gọi là dao động
              tắt dần.
            </p>
          </article>

          <article className="damped-intro-card">
            <span className="damped-intro-card__icon damped-intro-card__icon--fuchsia">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>

            <h3>
              Tiêu hao Cơ năng
            </h3>

            <p>
              Nguyên nhân sinh ra hiện tượng tắt
              dần là do công âm của{
              " "
              }
              <strong>lực ma sát</strong>
              {" "}và{
              " "
              }
              <strong>lực cản môi trường</strong>
              . Phần cơ năng bị mất đi này không
              biến mất mà liên tục chuyển hóa
              thành nhiệt năng làm nóng môi
              trường.
            </p>
          </article>

          <article className="damped-intro-formula">
            <div className="damped-intro-formula__panel">
              <span>
                Phương trình li độ
              </span>

              <DampedMath
                block
                math="x = A_0 \\cdot e^{-\\beta t} \\cdot \\cos(\\omega t + \\varphi)"
              />
            </div>

            <div className="damped-intro-formula__explanation">
              <span>
                Phân tích hàm số
              </span>

              <ul>
                <li>
                  <b aria-hidden="true">⊛</b>
                  <span>
                    <DampedMath math="A_0" />:
                    Biên độ dao động ban đầu tại
                    thời điểm{
                    " "
                    }
                    <DampedMath math="t=0" />.
                  </span>
                </li>

                <li>
                  <b aria-hidden="true">⊛</b>
                  <span>
                    <DampedMath math="e^{-\\beta t}" />:
                    Nhân tử suy giảm hàm mũ (Hệ
                    số{
                    " "
                    }
                    <DampedMath math="\\beta" />{
                    " "
                    }
                    càng lớn biểu thị lực cản
                    càng mạnh, biên độ tắt càng
                    nhanh).
                  </span>
                </li>

                <li>
                  <b aria-hidden="true">⊛</b>
                  <span>
                    Phương trình mô tả đường hình
                    sin bị bóp nghẹt biên độ qua
                    từng chu kì.
                  </span>
                </li>
              </ul>
            </div>
          </article>
        </div>

        <div className="damped-intro__actions">
          <Button
            type="button"
            className="damped-button damped-button--primary"
            onClick={onContinue}
          >
            Chuẩn bị Thí nghiệm
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
