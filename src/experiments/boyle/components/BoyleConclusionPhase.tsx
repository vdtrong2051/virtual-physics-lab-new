import {
  useMemo,
  useState,
} from "react";

import Button from "../../../components/ui/Button";

import {
  boyleObservationPrompts,
  boylePhysicsConfig,
  boyleUnits,
} from "../data";

import {
  calculateMaxPressureVolumeDeviationPercent,
  calculateMeanPressureVolume,
} from "../math/boyleMath";

import type {
  BoyleMeasurement,
  BoyleObservation,
  BoyleObservationId,
} from "../model";

import BoyleGraph from "./BoyleGraph";

type BoyleConclusionPhaseProps = {
  measurements:
    readonly BoyleMeasurement[];

  observations:
    readonly BoyleObservation[];

  onObservationChange: (
    id: BoyleObservationId,
    response: string,
  ) => void;

  onBack: () => void;
  onContinue: () => void;
};

export default function BoyleConclusionPhase({
  measurements,
  observations,
  onObservationChange,
  onBack,
  onContinue,
}: BoyleConclusionPhaseProps) {
  const [
    showTheory,
    setShowTheory,
  ] = useState(false);

  const observationById =
    useMemo(
      () =>
        new Map(
          observations.map(
            (observation) => [
              observation.id,
              observation.response,
            ],
          ),
        ),
      [observations],
    );

  const meanPressureVolume =
    calculateMeanPressureVolume(
      measurements,
    );

  const maxDeviationPercent =
    calculateMaxPressureVolumeDeviationPercent(
      measurements,
      boylePhysicsConfig.boyleConstant,
    );

  const hasAllObservations =
    boyleObservationPrompts.every(
      (observation) =>
        (
          observationById.get(
            observation.id,
          ) ?? ""
        ).trim().length > 0,
    );

  function handleObservationChange(
    id: BoyleObservationId,
    response: string,
  ) {
    onObservationChange(
      id,
      response,
    );

    if (showTheory) {
      setShowTheory(false);
    }
  }

  return (
    <div className="boyle-conclusion">
      <div className="boyle-conclusion__inner">
        <span className="boyle-content-phase__badge">
          Phần 4 · Kết luận thí nghiệm
        </span>

        <section className="boyle-conclusion__section">
          <div className="boyle-conclusion__section-heading">
            <span>
              01
            </span>

            <div>
              <h3>
                Kiểm tra bằng chứng thực nghiệm
              </h3>

              <p>
                Quan sát lại số liệu và đồ thị trước
                khi đưa ra nhận xét.
              </p>
            </div>
          </div>

          {measurements.length === 0 ? (
            <div className="boyle-conclusion__no-data">
              Chưa có số liệu thực nghiệm. Bạn vẫn có
              thể tiếp tục giữa các bước, nhưng cần quay
              lại Thực hành để thu thập dữ liệu trước khi
              đưa ra kết luận có căn cứ.
            </div>
          ) : (
            <>
              <div className="boyle-conclusion__evidence">
                <div className="boyle-conclusion__metric">
                  <span>
                    Số lần đo
                  </span>

                  <strong>
                    {measurements.length}
                    {" / "}
                    {
                      boylePhysicsConfig
                        .targetMeasurementCount
                    }
                  </strong>
                </div>

                <div className="boyle-conclusion__metric">
                  <span>
                    pV trung bình
                  </span>

                  <strong>
                    {meanPressureVolume ===
                    null
                      ? "Chưa có số liệu"
                      : `${meanPressureVolume.toFixed(
                          3,
                        )} ${
                          boyleUnits.pressureVolume
                        }`}
                  </strong>
                </div>

                <div className="boyle-conclusion__metric">
                  <span>
                    Độ lệch lớn nhất
                  </span>

                  <strong>
                    {maxDeviationPercent ===
                    null
                      ? "Chưa có số liệu"
                      : `${maxDeviationPercent.toFixed(
                          2,
                        )}%`}
                  </strong>
                </div>
              </div>

              <BoyleGraph
                measurements={
                  measurements
                }
              />
            </>
          )}
        </section>

        <section className="boyle-conclusion__section">
          <div className="boyle-conclusion__section-heading">
            <span>
              02
            </span>

            <div>
              <h3>
                Nhận xét của bạn
              </h3>

              <p>
                Viết nhận xét từ những gì bạn vừa đo
                và quan sát được.
              </p>
            </div>
          </div>

          <div className="boyle-observation-list">
            {boyleObservationPrompts.map(
              (
                observation,
                index,
              ) => (
                <label
                  key={
                    observation.id
                  }
                  className="boyle-observation"
                >
                  <span className="boyle-observation__number">
                    Câu {index + 1}
                  </span>

                  <strong>
                    {
                      observation.prompt
                    }
                  </strong>

                  <textarea
                    value={
                      observationById.get(
                        observation.id,
                      ) ?? ""
                    }
                    onChange={(
                      event,
                    ) =>
                      handleObservationChange(
                        observation.id,
                        event.target
                          .value,
                      )
                    }
                    rows={4}
                    placeholder="Nhập nhận xét của bạn..."
                  />
                </label>
              ),
            )}
          </div>
        </section>

        <section className="boyle-conclusion__section">
          <div className="boyle-conclusion__section-heading">
            <span>
              03
            </span>

            <div>
              <h3>
                Đối chiếu với định luật
              </h3>

              <p>
                Hoàn thành phần nhận xét trước khi mở
                nội dung đối chiếu.
              </p>
            </div>
          </div>

          {!showTheory ? (
            <div className="boyle-conclusion__reveal">
              <Button
                type="button"
                className="experiment-template__button experiment-template__button--primary"
                disabled={
                  !hasAllObservations
                }
                onClick={() =>
                  setShowTheory(true)
                }
              >
                Đối chiếu kết luận
              </Button>

              {!hasAllObservations && (
                <span>
                  Hãy trả lời đủ 2 câu nhận xét phía trên.
                </span>
              )}
            </div>
          ) : (
            <div className="boyle-theory-result">
              <span className="boyle-theory-result__label">
                Kết luận vật lý
              </span>

              <p>
                Với một lượng khí xác định ở nhiệt độ
                không đổi, khi thể tích giảm thì áp suất
                tăng và ngược lại. Áp suất của khí tỉ lệ
                nghịch với thể tích.
              </p>

              <div className="boyle-theory-result__formula">
                <span>
                  p
                  <sub>1</sub>
                  V
                  <sub>1</sub>
                </span>

                <span>=</span>

                <span>
                  p
                  <sub>2</sub>
                  V
                  <sub>2</sub>
                </span>
              </div>

              <p className="boyle-theory-result__note">
                Trong thực hành, cần nén hoặc giãn khí
                đủ chậm để khối khí có thời gian trao đổi
                nhiệt với môi trường và trở lại trạng thái
                cân bằng. Nén quá nhanh tạo quá trình gần
                đoạn nhiệt và làm sai lệch phép đo.
              </p>
            </div>
          )}
        </section>

        <div className="boyle-phase-actions">
          <Button
            type="button"
            className="experiment-template__button"
            onClick={onBack}
          >
            Quay lại thực hành
          </Button>

          <Button
            type="button"
            className="experiment-template__button experiment-template__button--primary"
            onClick={
              onContinue
            }
          >
            Chuyển sang luyện tập
          </Button>
        </div>
      </div>
    </div>
  );
}