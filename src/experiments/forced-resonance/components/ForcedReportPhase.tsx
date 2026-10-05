import Button from "../../../components/ui/Button";
import ForcedMath from "./ForcedMath";

function Lines({ rows }: { rows: number }) {
  return <div className="forced-report-lines">{Array.from({ length: rows }, (_, index) => <span key={index} />)}</div>;
}

export default function ForcedReportPhase({ onBack }: { onBack: () => void }) {
  return <div className="forced-report">
    <div className="forced-report__toolbar"><Button type="button" onClick={onBack}>← Quay lại</Button><strong>Phiếu Báo Cáo</strong><Button type="button" className="forced-button--report" onClick={() => window.setTimeout(() => window.print(), 150)}>🖨 In Báo Cáo</Button></div>
    <div className="forced-report__pages">
      <article id="forced-printable-report" className="forced-report-sheet">
        <h1>Báo Cáo Thực Hành Vật Lí 11</h1><h2>Nghiên Cứu Dao Động Tắt Dần</h2>
        <div className="forced-report-identity"><p>Họ và tên: <span /></p><p>Lớp: <span /> Nhóm: <span /></p></div><hr />
        <section><h3>1. Mục đích thí nghiệm</h3><p>Khảo sát ảnh hưởng của lực ma sát và lực cản môi trường lên biên độ và cơ năng của một hệ dao động cơ học thông qua việc vẽ đồ thị li độ - thời gian.</p></section>
        <section><h3>2. Kết quả quan sát vệt mực</h3><p>Mô tả hình dạng của đồ thị do mũi bút dạ vẽ lại trên tấm giấy cuộn (nhận xét về khoảng cách giữa <ForcedMath math="2" /> đỉnh liên tiếp và sự thay đổi độ cao của đỉnh sóng):</p><Lines rows={3} /></section>
        <section><h3>3. Phân tích nguyên lý Vật lý</h3><p>- Trong quá trình dao động, cơ năng của hệ bị tiêu hao và chuyển hóa dần thành:</p><Lines rows={2} /><p>- Nguyên nhân trực tiếp gây ra sự tiêu hao này là do công của lực:</p><Lines rows={2} /></section>
        <section><h3>4. Tìm hiểu thế giới tự nhiên dưới góc độ Vật lý</h3><p><strong>a. Ứng dụng có lợi (Hệ thống giảm xóc ô tô/xe máy)</strong></p><p>Các kĩ sư chế tạo phuộc nhún chứa dầu nhớt bên trong xi-lanh để làm gì? Hiện tượng vật lý nào đã được áp dụng triệt để ở đây để xe không bị xóc nảy liên tục khi qua ổ gà?</p><Lines rows={3} /><p><strong>b. Ảnh hưởng có hại (Đồng hồ quả lắc)</strong></p><p>Dao động tắt dần khiến quả lắc đồng hồ sẽ dừng lại sau một thời gian. Người thợ đồng hồ đã cung cấp năng lượng bù đắp lại phần cơ năng bị mất mát bằng cơ cấu nào?</p><Lines rows={2} /></section>
      </article>
      <article className="forced-report-sheet">
        <section><h3>5. Bài toán: Tính toán sự mất mát cơ năng</h3><p>Một con lắc lò xo dao động tắt dần chậm. Sau mỗi một chu kì, biên độ của con lắc giảm <ForcedMath math="5\\%" /> so với biên độ của chu kì ngay trước đó.</p><p><strong>a. Sau <ForcedMath math="2" /> chu kì, biên độ <ForcedMath math="A_2" /> còn lại bao nhiêu phần trăm so với <ForcedMath math="A_0" />?</strong></p><Lines rows={6} /><p><strong>b. Tính phần trăm cơ năng của hệ đã bị mất đi sau <ForcedMath math="2" /> chu kì dao động.</strong></p><p className="forced-report-hint">Gợi ý: <ForcedMath math="W \\sim A^2" />; <ForcedMath math="\\frac{\\Delta W}{W_0}=\\frac{W_0-W_2}{W_0}\\cdot100\\%" />.</p><Lines rows={8} /></section>
        <footer>Ngày ....... tháng ....... năm 20.......<strong>Người làm báo cáo</strong><small>(Ký và ghi rõ họ tên)</small></footer>
      </article>
    </div>
  </div>;
}
