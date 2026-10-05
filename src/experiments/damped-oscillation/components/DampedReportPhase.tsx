import PrintableReportShell from "../../../components/experiment/PrintableReportShell";
import Button from "../../../components/ui/Button";

import DampedMath from "./DampedMath";

type DampedReportPhaseProps = {
  onBack: () => void;
};

export default function DampedReportPhase({
  onBack,
}: DampedReportPhaseProps) {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="damped-report">
      <div className="damped-report__toolbar">
        <Button
          type="button"
          className="damped-button damped-button--secondary"
          onClick={onBack}
        >
          ← Quay lại
        </Button>

        <div>
          <strong>Phiếu Báo Cáo</strong>
          <span>
            In ấn tự nhiên (Không giới hạn trang)
          </span>
        </div>

        <Button
          type="button"
          className="damped-button damped-button--primary"
          onClick={handlePrint}
        >
          🖨 In Báo Cáo
        </Button>
      </div>

      <div className="damped-report__scroll">
        <PrintableReportShell
          id="damped-printable-report"
          className="damped-report-sheet"
          experimentTitle="NGHIÊN CỨU DAO ĐỘNG TẮT DẦN"
        >
          <div className="damped-report-sheet__content">
            <section className="damped-report-sheet__avoid-break">
              <h3>1. Mục đích thí nghiệm</h3>
              <p>
                Khảo sát ảnh hưởng của lực ma sát
                và lực cản môi trường lên biên độ
                và cơ năng của một hệ dao động cơ
                học thông qua việc vẽ và phân tích
                đồ thị li độ - thời gian.
              </p>
            </section>

            <section>
              <h3>
                2. Kết quả quan sát và Vẽ đồ thị
              </h3>

              <div className="damped-report-sheet__indented">
                <div className="damped-report-sheet__avoid-break">
                  <h4>a. Kết quả vệt mực:</h4>
                  <p>
                    Mô tả hình dạng của đồ thị do
                    mũi bút dạ vẽ lại trên tấm giấy
                    cuộn (nhận xét về khoảng cách
                    giữa{
                    " "
                    }
                    <DampedMath math="2" /> đỉnh
                    liên tiếp và sự thay đổi độ cao
                    của đỉnh sóng):
                  </p>
                  <BlankLines rows={3} />
                </div>

                <div className="damped-report-sheet__avoid-break">
                  <h4>
                    b. Phác họa đồ thị dao động ({
                    <DampedMath math="x-t" />
                    }) của con lắc trong{
                    " "
                    }
                    <DampedMath math="2" /> môi
                    trường:
                  </h4>

                  <div className="damped-report-sheet__graphs">
                    <GraphSketch
                      label="Không khí (Lực cản nhỏ)"
                    />
                    <GraphSketch
                      label="Nước (Lực cản lớn)"
                    />
                  </div>
                </div>

                <div className="damped-report-sheet__avoid-break">
                  <h4>c. Nhận xét:</h4>
                  <p>
                    So sánh tốc độ giảm biên độ và
                    số chu kì thực hiện được của con
                    lắc trong{
                    " "
                    }
                    <DampedMath math="2" /> môi
                    trường trên:
                  </p>
                  <BlankLines rows={3} />
                </div>
              </div>
            </section>

            <section className="damped-report-sheet__avoid-break">
              <h3>
                3. Phân tích nguyên lý Vật lý
              </h3>

              <p>
                - Cơ năng của hệ bị tiêu hao và
                chuyển hóa dần thành:{
                " "
                }
                <AnswerLine />
              </p>

              <p>
                - Nguyên nhân là do công của lực:{
                " "
                }
                <AnswerLine />
              </p>
            </section>

            <section>
              <h3>
                4. Tìm hiểu thế giới tự nhiên dưới
                góc độ Vật lý
              </h3>

              <div className="damped-report-sheet__indented">
                <div className="damped-report-sheet__avoid-break">
                  <h4>
                    a. Ứng dụng có lợi (Hệ thống
                    giảm xóc ô tô/xe máy)
                  </h4>
                  <p>
                    Các kĩ sư chế tạo phuộc nhún
                    chứa dầu nhớt bên trong xi-lanh
                    để làm gì? Hiện tượng vật lý nào
                    đã được áp dụng triệt để ở đây để
                    xe không bị xóc nảy liên tục khi
                    qua ổ gà?
                  </p>
                  <BlankLines rows={4} />
                </div>

                <div className="damped-report-sheet__avoid-break">
                  <h4>
                    b. Ảnh hưởng có hại (Đồng hồ
                    quả lắc)
                  </h4>
                  <p>
                    Dao động tắt dần khiến quả lắc
                    đồng hồ sẽ dừng lại sau một thời
                    gian. Người thợ đồng hồ đã cung
                    cấp năng lượng bù đắp lại phần
                    cơ năng bị mất mát bằng cơ cấu
                    nào?
                  </p>
                  <BlankLines rows={4} />
                </div>
              </div>
            </section>

            <section>
              <h3>
                5. Bài toán: Tính toán sự mất mát
                cơ năng
              </h3>

              <p className="damped-report-sheet__problem">
                Một con lắc lò xo dao động tắt dần
                chậm. Khảo sát bằng cảm biến cho
                thấy:{
                " "
                }
                <strong>
                  Sau mỗi một chu kì, biên độ của
                  con lắc giảm{
                  " "
                  }
                  <DampedMath math="5\\%" /> so
                  với biên độ của chu kì ngay trước
                  đó.
                </strong>
              </p>

              <div className="damped-report-sheet__avoid-break">
                <h4>
                  a. Sau{
                  " "
                  }
                  <DampedMath math="2" /> chu kì,
                  biên độ của con lắc ({
                  <DampedMath math="A_2" />
                  }) còn lại bao nhiêu phần trăm so
                  với biên độ ban đầu ({
                  <DampedMath math="A_0" />
                  })?
                </h4>
                <BlankLines rows={5} />
              </div>

              <div className="damped-report-sheet__avoid-break">
                <h4>
                  b. Tính phần trăm cơ năng của hệ
                  đã bị mất đi sau{
                  " "
                  }
                  <DampedMath math="2" /> chu kì
                  dao động.
                </h4>

                <p className="damped-report-sheet__hint">
                  *Gợi ý: Biết cơ năng của dao động
                  điều hòa tỉ lệ thuận với bình
                  phương biên độ ({
                  <DampedMath math="W \\sim A^2" />
                  }). Độ giảm phần trăm cơ năng được
                  tính bằng công thức:{
                  " "
                  }
                  <DampedMath math="\\frac{\\Delta W}{W_0} = \\frac{W_0 - W_2}{W_0} \\cdot 100\\%" />
                </p>

                <BlankLines rows={6} />
              </div>
            </section>
          </div>
        </PrintableReportShell>
      </div>
    </div>
  );
}

function BlankLines({
  rows,
}: {
  rows: number;
}) {
  return (
    <div className="damped-report-sheet__blank-lines">
      {Array.from({ length: rows }).map(
        (_, index) => (
          <span key={index} />
        ),
      )}
    </div>
  );
}

function AnswerLine() {
  return (
    <span className="damped-report-sheet__answer-line" />
  );
}

function GraphSketch({
  label,
}: {
  label: string;
}) {
  return (
    <div className="damped-report-sheet__graph">
      <strong>{label}</strong>
      <em>
        Học sinh vẽ đồ thị vào đây...
      </em>
      <span className="damped-report-sheet__graph-y" />
      <span className="damped-report-sheet__graph-x" />
      <b className="damped-report-sheet__graph-y-label">
        x
      </b>
      <b className="damped-report-sheet__graph-x-label">
        t
      </b>
    </div>
  );
}
