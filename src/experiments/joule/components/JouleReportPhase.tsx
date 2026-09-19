import PrintableReportShell from "../../../components/experiment/PrintableReportShell";
import Button from "../../../components/ui/Button";

import {
  joulePhysicsConfig,
  jouleUnits,
} from "../data";

import {
  calculateMeanMechanicalEquivalent,
  calculateMeasurementHeatCalories,
  calculateMeasurementMechanicalEquivalent,
  calculateRelativeErrorPercent,
} from "../math/jouleMath";

import type {
  JouleMeasurement,
} from "../model";

type JouleReportPhaseProps = {
  measurements:
    readonly JouleMeasurement[];

  onBack: () => void;
};

export default function JouleReportPhase({
  measurements,
  onBack,
}: JouleReportPhaseProps) {
  function handlePrint() {
    window.print();
  }

  const referenceRows =
    measurements.map(
      (measurement) => ({
        measurement,

        heatCalories:
          calculateMeasurementHeatCalories(
            measurement,
            joulePhysicsConfig
              .waterMassKg,
            joulePhysicsConfig
              .waterSpecificHeatCalPerKgC,
          ),

        mechanicalEquivalent:
          calculateMeasurementMechanicalEquivalent(
            measurement,
            joulePhysicsConfig
              .gravityMPerS2,
            joulePhysicsConfig
              .waterMassKg,
            joulePhysicsConfig
              .waterSpecificHeatCalPerKgC,
          ),
      }),
    );

  const meanMechanicalEquivalent =
    calculateMeanMechanicalEquivalent(
      measurements,
      joulePhysicsConfig
        .gravityMPerS2,
      joulePhysicsConfig
        .waterMassKg,
      joulePhysicsConfig
        .waterSpecificHeatCalPerKgC,
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
    <div className="joule-report">
      <div className="joule-report__screen">
        <span className="joule-content-phase__badge">
          Phần 6 · Báo cáo
        </span>

        <div className="joule-report__heading">
          <div>
            <h3>
              Báo cáo thực hành
            </h3>

            <p>
              Đối chiếu dữ liệu điện tử của phiên
              thí nghiệm và in phiếu thực hành A4
              riêng của thí nghiệm Joule để tự
              hoàn thành báo cáo.
            </p>
          </div>

          <div className="joule-report__actions">
            <Button
              type="button"
              className="experiment-template__button"
              onClick={onBack}
            >
              Quay lại luyện tập
            </Button>

            <Button
              type="button"
              className="experiment-template__button experiment-template__button--primary"
              onClick={handlePrint}
            >
              In / Lưu PDF
            </Button>
          </div>
        </div>

        <section className="joule-report-reference">
          <div className="joule-report-section-heading">
            <span>
              01
            </span>

            <div>
              <h4>
                Dữ liệu tham chiếu
              </h4>

              <p>
                Đây là dữ liệu thực tế đã ghi trong
                phiên thí nghiệm. Phần này chỉ dùng
                để đối chiếu và không được tự động
                điền vào phiếu A4 bên dưới.
              </p>
            </div>
          </div>

          <div className="joule-report-reference__table-wrap">
            <table className="joule-report-reference__table">
              <thead>
                <tr>
                  <th>
                    Lần
                  </th>

                  <th>
                    m
                  </th>

                  <th>
                    h
                  </th>

                  <th>
                    A
                  </th>

                  <th>
                    ΔT
                  </th>

                  <th>
                    Q
                  </th>

                  <th>
                    J
                  </th>
                </tr>
              </thead>

              <tbody>
                {referenceRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="joule-report-reference__empty"
                    >
                      Chưa có số liệu
                    </td>
                  </tr>
                ) : (
                  referenceRows.map(
                    (
                      {
                        measurement,
                        heatCalories,
                        mechanicalEquivalent,
                      },
                      index,
                    ) => (
                      <tr key={index}>
                        <th scope="row">
                          {index + 1}
                        </th>

                        <td>
                          {measurement.totalMassKg.toFixed(
                            1,
                          )}
                        </td>

                        <td>
                          {measurement.dropHeightM.toFixed(
                            1,
                          )}
                        </td>

                        <td>
                          {measurement.mechanicalWorkJ.toFixed(
                            1,
                          )}
                        </td>

                        <td>
                          {measurement.temperatureRiseC.toFixed(
                            4,
                          )}
                        </td>

                        <td>
                          {heatCalories.toFixed(
                            3,
                          )}
                        </td>

                        <td>
                          {mechanicalEquivalent.toFixed(
                            3,
                          )}
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="joule-report-reference__units">
            <span>
              m: tổng khối lượng tạ (
              {jouleUnits.mass})
            </span>

            <span>
              h: {jouleUnits.height}
            </span>

            <span>
              A: {jouleUnits.work}
            </span>

            <span>
              ΔT:{" "}
              {jouleUnits.temperatureRise}
            </span>

            <span>
              Q: {jouleUnits.heat}
            </span>

            <span>
              J:{" "}
              {
                jouleUnits
                  .mechanicalEquivalent
              }
            </span>
          </div>

          <div className="joule-report-reference__summary">
            <article>
              <span>
                Số lần đo
              </span>

              <strong>
                {measurements.length}
                {" / "}
                {
                  joulePhysicsConfig
                    .targetMeasurementCount
                }
              </strong>
            </article>

            <article>
              <span>
                J trung bình
              </span>

              <strong>
                {meanMechanicalEquivalent === null
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

            <article>
              <span>
                J chuẩn
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

            <article>
              <span>
                Sai số tỉ đối
              </span>

              <strong>
                {relativeErrorPercent === null
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
          </div>
        </section>

        <section className="joule-report-preview">
          <div className="joule-report-section-heading">
            <span>
              02
            </span>

            <div>
              <h4>
                Phiếu thực hành A4
              </h4>

              <p>
                Phiếu dưới đây giữ đúng nội dung
                riêng của thí nghiệm Joule và luôn
                để trống phần số liệu, tính toán,
                câu trả lời để học sinh tự hoàn thành.
              </p>
            </div>
          </div>

          <PrintableJouleReport />
        </section>
      </div>
    </div>
  );
}

function PrintableJouleReport() {
  return (
    <PrintableReportShell
      id="joule-printable-report"
      className="joule-report-sheet"
      experimentTitle="THÍ NGHIỆM JOULE: XÁC ĐỊNH ĐƯƠNG LƯỢNG CƠ NHIỆT"
      description="Chứng minh sự tương đương giữa Công cơ học và Nhiệt lượng"
      datePlaceholder="Ngày ....... tháng ....... năm 2026"
    >
      <section>
        <h3>
          I. Cơ sở lí thuyết
        </h3>

        <p>
          Thí nghiệm nhằm đánh đổ
          "thuyết chất lưu", khẳng định
          nhiệt năng thực chất được sinh
          ra từ công cơ học. Mục tiêu của
          bài là xác định hằng số chuyển
          đổi giữa Cơ năng (Joule) và
          Nhiệt lượng (Calo), gọi là{" "}
          <strong>
            Đương lượng cơ nhiệt (J)
          </strong>
          .
        </p>

        <ul>
          <li>
            Công do hệ tạ thực hiện:{" "}
            <em>
              A = m · g · h
            </em>{" "}
            (Đơn vị: Joule), trong đó m
            là tổng khối lượng tạ.
          </li>

          <li>
            Nhiệt lượng khối nước nhận
            được:{" "}
            <em>
              Q = M · c
              <sub>cal</sub> · ΔT
            </em>{" "}
            (Đơn vị: Calo).
          </li>
        </ul>

        <div className="joule-report-sheet__formula">
          Đương lượng cơ nhiệt:
          {" "}
          J = A / Q
          {" "}
          (J/cal)
        </div>

        <p className="joule-report-sheet__note">
          Trong đó: g ={" "}
          {
            joulePhysicsConfig
              .gravityMPerS2
          }{" "}
          m/s²; M ={" "}
          {
            joulePhysicsConfig
              .waterMassKg
          }{" "}
          kg; c
          <sub>cal</sub> ={" "}
          {
            joulePhysicsConfig
              .waterSpecificHeatCalPerKgC
          }{" "}
          cal/(kg·K).
        </p>
      </section>

      <section>
        <h3>
          II. Bảng Số Liệu Thực Nghiệm
        </h3>

        <table className="joule-report-sheet__table">
          <thead>
            <tr>
              <th>
                Lần
              </th>

              <th>
                Tổng KL tạ
                <br />
                m (kg)
              </th>

              <th>
                Độ cao thả
                <br />
                h (m)
              </th>

              <th>
                Công cơ học
                <br />
                A (J)
              </th>

              <th>
                Độ tăng nhiệt
                <br />
                ΔT (°C)
              </th>

              <th>
                Nhiệt lượng
                <br />
                Q (cal)
              </th>

              <th>
                Đương lượng
                <br />
                J = A/Q
                <br />
                (J/cal)
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({
              length:
                joulePhysicsConfig
                  .targetMeasurementCount,
            }).map(
              (_, index) => (
                <tr key={index}>
                  <th scope="row">
                    {index + 1}
                  </th>

                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
              ),
            )}
          </tbody>
        </table>
      </section>

      <section className="joule-report-sheet__avoid-break">
        <h3>
          III. Xử Lí Số Liệu và Tính Sai Số
        </h3>

        <p>
          <strong>
            1. Tính Đương lượng cơ nhiệt
            trung bình:
          </strong>
        </p>

        <div className="joule-report-sheet__formula">
          J̄ = (ΣJᵢ) /{" "}
          {
            joulePhysicsConfig
              .targetMeasurementCount
          }
          {" = "}
          ........................................
          {" "}
          (J/cal)
        </div>

        <p>
          <strong>
            2. Đánh giá sai số so với
            Hằng số chuẩn:
          </strong>
        </p>

        <p className="joule-report-sheet__note">
          Giá trị chuẩn sử dụng trong bài:
          {" "}
          J
          <sub>chuẩn</sub>
          {" ≈ "}
          {
            joulePhysicsConfig
              .standardMechanicalEquivalentJPerCal
              .toFixed(2)
          }
          {" "}
          J/cal. Tính sai số tỉ đối của
          phép đo:
        </p>

        <div className="joule-report-sheet__formula">
          δ = |J̄ -{" "}
          {
            joulePhysicsConfig
              .standardMechanicalEquivalentJPerCal
              .toFixed(2)
          }
          | /{" "}
          {
            joulePhysicsConfig
              .standardMechanicalEquivalentJPerCal
              .toFixed(2)
          }
          {" × 100% = "}
          ........................................ %
        </div>
      </section>

      <section className="joule-report-sheet__analysis">
        <h3>
          IV. Phân Tích Lịch Sử &amp; Vật Lí
        </h3>

        <div className="joule-report-sheet__question">
          <p>
            <strong>
              Câu 1: Ý nghĩa lịch sử của
              Thí nghiệm
            </strong>
          </p>

          <p>
            Trước thí nghiệm này, giới
            khoa học thế kỷ 19 tin vào
            "thuyết chất lưu" – coi nhiệt
            là một chất lỏng vô hình chảy
            từ vật nóng sang vật lạnh.
            Bằng cách nào việc đo được tỉ
            lệ không đổi J = 4.18 J/cal
            giữa Cơ năng và Nhiệt năng đã
            trực tiếp đánh đổ học thuyết
            này?
          </p>

          <BlankLines count={3} />
        </div>

        <div className="joule-report-sheet__question">
          <p>
            <strong>
              Câu 2: Bản chất vi mô của
              sự truyền nhiệt
            </strong>
          </p>

          <p>
            Hệ thống cánh quạt kim loại
            xoay tít không hề tỏa nhiệt
            như ngọn lửa. Vậy dựa vào{" "}
            <strong>
              Thuyết động học phân tử
            </strong>
            , hãy giải thích chi tiết cơ
            chế nào đã làm tăng nhiệt độ
            của nước khi cánh quạt khuấy
            động?
          </p>

          <BlankLines count={3} />
        </div>

        <div className="joule-report-sheet__question joule-report-sheet__avoid-break">
          <p>
            <strong>
              Câu 3: Phân tích nguyên
              nhân hao hụt
            </strong>
          </p>

          <p>
            Trong thực tế, đương lượng cơ
            nhiệt J học sinh đo được từ
            thiết bị thường lớn hơn 4.18
            một chút (tức là cần nhiều Cơ
            năng A hơn dự kiến để tạo ra
            cùng một lượng Nhiệt Q). Hãy
            liệt kê ít nhất 2 vị trí trong
            cơ cấu thí nghiệm gây ra sự
            hao phí năng lượng này.
          </p>

          <BlankLines count={3} />
        </div>
      </section>
    </PrintableReportShell>
  );
}

function BlankLines({
  count,
}: {
  count: number;
}) {
  return (
    <div className="joule-report-sheet__blank-lines">
      {Array.from({
        length: count,
      }).map(
        (_, index) => (
          <span key={index} />
        ),
      )}
    </div>
  );
}