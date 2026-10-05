import Button from "../../../components/ui/Button";
import ForcedMath from "./ForcedMath";

export default function ForcedIntroPhase({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="forced-intro">
      <div className="forced-intro__grid" aria-hidden="true" />
      <div className="forced-intro__rings" aria-hidden="true"><i /><i /><i /></div>
      <div className="forced-intro__content">
        <header>
          <span className="forced-badge"><i /> Chuyên đề Dao động cơ</span>
          <h2>Dao Động Cưỡng Bức &<strong>Hiện Tượng Cộng Hưởng</strong></h2>
        </header>
        <div className="forced-intro__cards">
          <article><span className="forced-card-icon forced-card-icon--indigo">⌁</span><h3>Ngoại lực tuần hoàn</h3><p>Khi một hệ dao động chịu tác dụng của một ngoại lực biến thiên tuần hoàn theo thời gian, hệ sẽ bị “ép” phải dao động theo. Quá trình này được định nghĩa là <strong>Dao động cưỡng bức</strong>.</p></article>
          <article><span className="forced-card-icon forced-card-icon--green">ⓘ</span><h3>Đặc điểm Biên độ</h3><p>Biên độ của dao động cưỡng bức không đổi và phụ thuộc vào độ chênh lệch giữa <strong>tần số ngoại lực</strong> (<ForcedMath math="f" />) và <strong>tần số riêng của hệ</strong> (<ForcedMath math="f_0" />). Độ lệch càng nhỏ, biên độ càng lớn.</p></article>
          <article className="forced-resonance-card"><div><span>Trạng thái cực đại</span><h3>Hiện tượng Cộng hưởng</h3><p>Là hiện tượng biên độ dao động cưỡng bức tăng vọt và đạt giá trị cực đại khi tần số của ngoại lực cưỡng bức tiến đến bằng với tần số riêng của hệ dao động.</p></div><aside><small>Điều kiện Toán học</small><ForcedMath block math="f = f_0 \\;\\; \\Rightarrow \\;\\; A = A_{\\text{max}}" /></aside></article>
        </div>
        <Button type="button" className="forced-button forced-button--primary" onClick={onContinue}>Chuẩn bị Thí nghiệm <span aria-hidden="true">→</span></Button>
      </div>
    </div>
  );
}
