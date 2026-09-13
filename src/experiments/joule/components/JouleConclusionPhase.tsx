import {
  useMemo,
} from "react";

import Button from "../../../components/ui/Button";

import {
  joulePhysicsConfig,
  jouleUnits,
} from "../data";

import {
  calculateAbsoluteError,
  calculateMeanMechanicalEquivalent,
  calculateRelativeErrorPercent,
} from "../math/jouleMath";

import type {
  JouleMeasurement,
} from "../model";

type JouleConclusionPhaseProps = {
  measurements:
    readonly JouleMeasurement[];

  onBack: () => void;

  onContinue: () => void;
};

export default function JouleConclusionPhase({
  measurements,
  onBack,
  onContinue,
}: JouleConclusionPhaseProps) {
  const targetMeasurementCount =
    joulePhysicsConfig
      .targetMeasurementCount;

  const measurementCount =
    measurements.length;

  const measurementComplete =
    measurementCount >=
    targetMeasurementCount;

  const meanMechanicalEquivalent =
    useMemo(
      () =>
        calculateMeanMechanicalEquivalent(
          measurements,
          joulePhysicsConfig
            .gravityMPerS2,
          joulePhysicsConfig
            .waterMassKg,
          joulePhysicsConfig
            .waterSpecificHeatCalPerKgC,
        ),
      [measurements],
    );

  const absoluteError =
    meanMechanicalEquivalent === null
      ? null
      : calculateAbsoluteError(
          meanMechanicalEquivalent,
          joulePhysicsConfig
            .standardMechanicalEquivalentJPerCal,
        );

  const relativeErrorPercent =
    meanMechanicalEquivalent === null
      ? null
      : calculateRelativeErrorPercent(
          meanMechanicalEquivalent,
          joulePhysicsConfig
            .standardMechanicalEquivalentJPerCal,
        );

  return (
    <div className="joule-content-phase">
      <div className="joule-content-phase__inner">
        <span className="joule-content-phase__badge">
          Phần 4 · Kết luận
        </span>

        <div className="joule-conclusion__heading">
          <div>
            <h2>
              Kết quả thí nghiệm Joule
            </h2>

            <p>
              Đối chiếu số liệu đã thu
              được với giá trị chuẩn của
              đương lượng cơ học của
              nhiệt.
            </p>
          </div>

          <div
            className={`joule-conclusion__status ${
              measurementComplete
                ? "joule-conclusion__status--complete"
                : ""
            }`}
          >
            <span>
              Số lần đo
            </span>

            <strong>
              {measurementCount}
              {" / "}
              {targetMeasurementCount}
            </strong>
          </div>
        </div>

        {!measurementComplete && (
          <div
            className="joule-conclusion__warning"
            role="status"
          >
            Dữ liệu hiện chưa đủ{" "}
            {targetMeasurementCount} lần
            đo. Các kết quả bên dưới chỉ
            được xem là kết quả tạm thời.
          </div>
        )}

        <section className="joule-conclusion-results">
          <article className="joule-conclusion-result">
            <span>
              Đương lượng cơ nhiệt
              trung bình
            </span>

            <strong>
              {meanMechanicalEquivalent ===
              null
                ? "—"
                : meanMechanicalEquivalent.toFixed(
                    3,
                  )}{" "}
              {
                jouleUnits
                  .mechanicalEquivalent
              }
            </strong>
          </article>

          <article className="joule-conclusion-result">
            <span>
              Giá trị chuẩn
            </span>

            <strong>
              {joulePhysicsConfig
                .standardMechanicalEquivalentJPerCal
                .toFixed(2)}{" "}
              {
                jouleUnits
                  .mechanicalEquivalent
              }
            </strong>
          </article>

          <article className="joule-conclusion-result">
            <span>
              Sai số tuyệt đối
            </span>

            <strong>
              {absoluteError === null
                ? "—"
                : absoluteError.toFixed(
                    3,
                  )}{" "}
              {
                jouleUnits
                  .mechanicalEquivalent
              }
            </strong>
          </article>

          <article className="joule-conclusion-result">
            <span>
              Sai số tỉ đối
            </span>

            <strong>
              {relativeErrorPercent ===
              null
                ? "—"
                : relativeErrorPercent.toFixed(
                    2,
                  )}{" "}
              {
                jouleUnits
                  .relativeError
              }
            </strong>
          </article>
        </section>

        <section className="joule-conclusion-main">
          <span className="joule-conclusion-main__label">
            Kết luận chính
          </span>

          <p>
            Khi hai quả tạ hạ xuống,
            thế năng của chúng giảm và
            thực hiện công làm quay cánh
            khuấy. Cơ năng đó được
            chuyển hóa thành nội năng của
            nước, làm nhiệt độ nước tăng
            lên.
          </p>

          <div className="joule-conclusion-formula">
            <span>
              A ≈ Q
            </span>

            <strong>
              1 cal ≈{" "}
              {joulePhysicsConfig
                .standardMechanicalEquivalentJPerCal
                .toFixed(2)}{" "}
              J
            </strong>
          </div>

          <p>
            Trong điều kiện cách nhiệt
            lý tưởng, công cơ học truyền
            vào hệ bằng độ tăng nội năng
            của nước. Kết quả thể hiện
            nguyên lý bảo toàn năng lượng:
            năng lượng không tự sinh ra
            hoặc mất đi mà chỉ chuyển hóa
            hoặc truyền từ hệ này sang hệ
            khác.
          </p>
        </section>

        <section className="joule-conclusion-applications">
          <div className="joule-conclusion-applications__heading">
            <span>
              Liên hệ thực tế
            </span>

            <h3>
              Cơ năng chuyển thành
              nội năng
            </h3>
          </div>

          <div className="joule-conclusion-applications__grid">
            <article className="joule-application-card">
              <span
                className="joule-application-card__icon"
                aria-hidden="true"
              >
                🔥
              </span>

              <div>
                <h4>
                  Má phanh xe
                </h4>

                <p>
                  Khi phanh, ma sát làm
                  động năng của xe giảm.
                  Phần năng lượng đó
                  chuyển thành nội năng,
                  làm má phanh và đĩa
                  phanh nóng lên.
                </p>
              </div>
            </article>

            <article className="joule-application-card">
              <span
                className="joule-application-card__icon"
                aria-hidden="true"
              >
                ☄️
              </span>

              <div>
                <h4>
                  Thiên thạch đi vào
                  khí quyển
                </h4>

                <p>
                  Lực cản của khí quyển
                  làm động năng của thiên
                  thạch giảm và chuyển
                  thành nội năng, khiến
                  vật nóng lên rất mạnh.
                </p>
              </div>
            </article>
          </div>
        </section>

        <div className="joule-phase-actions">
          <Button
            type="button"
            className="experiment-template__button"
            onClick={onBack}
          >
            Trở lại thực hành
          </Button>

          <Button
            type="button"
            className="experiment-template__button experiment-template__button--primary"
            onClick={onContinue}
          >
            Làm bài kiểm tra
          </Button>
        </div>
      </div>
    </div>
  );
}