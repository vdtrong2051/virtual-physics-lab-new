import Button from "../../../components/ui/Button";

import {
  boyleObservationPrompts,
  boylePhysicsConfig,
  boyleUnits,
} from "../data";

import {
  calculateInverseVolume,
} from "../math/boyleMath";

import type {
  BoyleMeasurement,
  BoyleObservation,
} from "../model";

import BoyleGraph from "./BoyleGraph";

type BoyleReportPhaseProps = {
  measurements:
    readonly BoyleMeasurement[];

  observations:
    readonly BoyleObservation[];

  onBack: () => void;
};

export default function BoyleReportPhase({
  measurements,
  observations,
  onBack,
}: BoyleReportPhaseProps) {
  function handlePrint() {
    window.print();
  }

  function getObservationResponse(
    id: BoyleObservation["id"],
  ) {
    return (
      observations.find(
        (observation) =>
          observation.id === id,
      )?.response.trim() ?? ""
    );
  }

  return (
    <div className="boyle-report">
      <div className="boyle-report__screen">
        <span className="boyle-content-phase__badge">
          Phần 6 · Báo cáo
        </span>

        <div className="boyle-report__heading">
          <div>
            <h3>
              Báo cáo thực hành
            </h3>

            <p>
              Đối chiếu dữ liệu điện tử của phiên
              thí nghiệm và in phiếu thực hành A4
              để tự hoàn thành báo cáo.
            </p>
          </div>

          <div className="boyle-report__actions">
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

        {/* ========================================
            1. DỮ LIỆU THAM CHIẾU
            ======================================== */}

        <section className="boyle-report-reference">
          <div className="boyle-report-section-heading">
            <span>
              01
            </span>

            <div>
              <h4>
                Dữ liệu tham chiếu
              </h4>

              <p>
                Đây là dữ liệu thực tế đã ghi trong
                phiên thí nghiệm, không phải đáp án
                điền sẵn cho phiếu báo cáo.
              </p>
            </div>
          </div>

          <div className="boyle-report-reference__table-wrap">
            <table className="boyle-report-reference__table">
              <thead>
                <tr>
                  <th>
                    Lần
                  </th>

                  <th>
                    V
                  </th>

                  <th>
                    1/V
                  </th>

                  <th>
                    p
                  </th>

                  <th>
                    pV
                  </th>
                </tr>
              </thead>

              <tbody>
                {measurements.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="boyle-report-reference__empty"
                    >
                      Chưa có số liệu
                    </td>
                  </tr>
                ) : (
                  measurements.map(
                    (
                      measurement,
                      index,
                    ) => (
                      <tr key={index}>
                        <th scope="row">
                          {index + 1}
                        </th>

                        <td>
                          {measurement.volume.toFixed(
                            2,
                          )}
                        </td>

                        <td>
                          {calculateInverseVolume(
                            measurement.volume,
                          ).toFixed(3)}
                        </td>

                        <td>
                          {measurement.pressure.toFixed(
                            3,
                          )}
                        </td>

                        <td>
                          {measurement.pressureVolume.toFixed(
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

          <div className="boyle-report-reference__units">
            <span>
              V: {boyleUnits.volume}
            </span>

            <span>
              1/V:{" "}
              {boyleUnits.inverseVolume}
            </span>

            <span>
              p: {boyleUnits.pressure}
            </span>

            <span>
              pV:{" "}
              {boyleUnits.pressureVolume}
            </span>
          </div>

          <BoyleGraph
            measurements={measurements}
          />

          <div className="boyle-report-observations">
            <h5>
              Nhận xét đã ghi
            </h5>

            {boyleObservationPrompts.map(
              (
                prompt,
                index,
              ) => {
                const response =
                  getObservationResponse(
                    prompt.id,
                  );

                return (
                  <div
                    key={prompt.id}
                    className="boyle-report-observation"
                  >
                    <span>
                      {index + 1}.
                    </span>

                    <div>
                      <strong>
                        {prompt.prompt}
                      </strong>

                      <p>
                        {response ||
                          "Chưa có nhận xét"}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </section>

        {/* ========================================
            2. PHIẾU A4
            ======================================== */}

        <section className="boyle-report-preview">
          <div className="boyle-report-section-heading">
            <span>
              02
            </span>

            <div>
              <h4>
                Phiếu thực hành A4
              </h4>

              <p>
                Phiếu dưới đây luôn để trống để học sinh
                tự ghi số liệu, tính toán và kết luận.
              </p>
            </div>
          </div>

          <PrintableBoyleReport />
        </section>
      </div>
    </div>
  );
}

function PrintableBoyleReport() {
  return (
    <article
      id="boyle-printable-report"
      className="boyle-report-sheet"
    >
      <header className="boyle-report-sheet__header">
        <h1>
          BÁO CÁO THỰC HÀNH VẬT LÍ
        </h1>

        <h2>
          KHẢO SÁT ĐỊNH LUẬT BOYLE-MARIOTTE
        </h2>

        <p>
          Khảo sát quá trình biến đổi trạng thái
          của một lượng khí khi nhiệt độ không đổi
        </p>
      </header>

      <section className="boyle-report-sheet__identity">
        <div>
          <strong>
            Họ và tên học sinh:
          </strong>

          <span />
        </div>

        <div className="boyle-report-sheet__identity-row">
          <div>
            <strong>
              Lớp:
            </strong>

            <span />
          </div>

          <div>
            <strong>
              Tổ/Nhóm:
            </strong>

            <span />
          </div>
        </div>
      </section>

      <hr />

      <section>
        <h3>
          1. Mục đích thí nghiệm
        </h3>

        <ul>
          <li>
            Thực hành thao tác trên mô hình
            thiết bị thí nghiệm ảo 3D.
          </li>

          <li>
            Khảo sát mối liên hệ giữa áp suất
            p và thể tích V của một lượng khí
            xác định khi nhiệt độ không đổi.
          </li>

          <li>
            Quan sát sự khác nhau giữa thao tác
            nén chậm và nén nhanh.
          </li>

          <li>
            Vẽ đồ thị sự phụ thuộc của p vào
            1/V và xử lí kết quả đo.
          </li>
        </ul>
      </section>

      <section>
        <h3>
          2. Cơ sở lí thuyết
        </h3>

        <p>
          <strong>
            2.1. Quá trình đẳng nhiệt là gì?
          </strong>
        </p>

        <BlankLines count={2} />

        <p>
          <strong>
            2.2. Viết biểu thức toán học của
            định luật Boyle-Mariotte:
          </strong>
        </p>

        <BlankLines count={1} />
      </section>

      <section>
        <h3>
          3. Tiến hành thí nghiệm
        </h3>

        <p>
          <strong>
            Câu hỏi tư duy:
          </strong>
        </p>

        <p>
          Vì sao cần nén hoặc giãn khí từ từ
          trước khi ghi số liệu? Điều gì xảy ra
          nếu pít-tông bị nén quá nhanh?
        </p>

        <BlankLines count={3} />
      </section>

      <section>
        <h3>
          4. Kết quả thí nghiệm
        </h3>

        <p className="boyle-report-sheet__caption">
          Bảng 1. Kết quả khảo sát sự phụ thuộc
          của p vào V
        </p>

        <table className="boyle-report-sheet__table">
          <thead>
            <tr>
              <th>
                Lần đo
              </th>

              <th>
                V
                <br />
                (cm³)
              </th>

              <th>
                1/V
                <br />
                (cm⁻³)
              </th>

              <th>
                p
                <br />
                (10⁵ Pa)
              </th>

              <th>
                pV
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({
              length:
                boylePhysicsConfig
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
                </tr>
              ),
            )}
          </tbody>
        </table>
      </section>

      <section className="boyle-report-sheet__avoid-break">
        <h3>
          5. Xử lí kết quả và đánh giá
        </h3>

        <p>
          <strong>
            5.1. Vẽ đồ thị sự phụ thuộc của
            áp suất p vào 1/V dựa trên số liệu
            Bảng 1.
          </strong>
        </p>

        <div className="boyle-report-sheet__graph-frame">
          <span>
            Học sinh tự vẽ đồ thị vào khung này
          </span>
        </div>

        <p>
          <strong>
            5.2. Nhận xét hình dạng đồ thị:
          </strong>
        </p>

        <BlankLines count={2} />

        <p>
          <strong>
            5.3. Giải thích bằng góc nhìn vi mô:
          </strong>
        </p>

        <p>
          Khi giảm thể tích khối khí, sự chuyển động
          và va chạm của các phân tử thay đổi như
          thế nào?
        </p>

        <BlankLines count={2} />
      </section>

      <section className="boyle-report-sheet__avoid-break">
        <h3>
          6. Tính toán sai số và ghi kết quả đo
        </h3>

        <p>
          <strong>
            6.1. Sai số dụng cụ:
          </strong>
        </p>

        <p>
          Δp = ............................................
          (10⁵ Pa)
        </p>

        <p>
          ΔV = ............................................
          (cm³)
        </p>

        <p>
          <strong>
            6.2. Với k = pV, tính sai số tỉ đối:
          </strong>
        </p>

        <div className="boyle-report-sheet__formula">
          δk = δp + δV
        </div>

        <p>
          Δk = δk × k̄ =
          ................................................................
        </p>

        <p>
          <strong>
            6.3. Ghi kết quả đo:
          </strong>
        </p>

        <div className="boyle-report-sheet__formula">
          k = k̄ ± Δk =
          ........................................................
        </div>
      </section>

      <footer className="boyle-report-sheet__signature">
        <div>
          <p>
            Ngày ...... tháng ...... năm ........
          </p>

          <strong>
            Học sinh thực hiện
          </strong>

          <p>
            (Ký và ghi rõ họ tên)
          </p>

          <div />
        </div>
      </footer>
    </article>
  );
}

function BlankLines({
  count,
}: {
  count: number;
}) {
  return (
    <div className="boyle-report-sheet__blank-lines">
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