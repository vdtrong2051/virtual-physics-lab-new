import Button from "../../../components/ui/Button";
import HarmonicMath from "./HarmonicMath";

export default function HarmonicIntroPhase({ onContinue }: { onContinue: () => void }) {
  return <div className="harmonic-intro"><div className="harmonic-intro__grid" aria-hidden="true" /><div className="harmonic-intro__content">
    <header><span className="harmonic-badge"><i /> Chuyên đề Dao động cơ</span><h2>Mối liên hệ giữa<strong>Dao Động Điều Hòa & Chuyển Động Tròn Đều</strong></h2></header>
    <div className="harmonic-intro__cards">
      <article><span className="harmonic-card-icon">◯</span><h3>Hình chiếu của chuyển động tròn đều</h3><p>Dao động điều hòa có thể được coi là hình chiếu của một chuyển động tròn đều xuống một đường thẳng nằm trong mặt phẳng quỹ đạo.</p></article>
      <article><span className="harmonic-card-icon harmonic-card-icon--amber">↕</span><h3>Các đại lượng tương ứng</h3><ul><li>Bán kính quỹ đạo <HarmonicMath math="R" /> chính là biên độ <HarmonicMath math="A" />.</li><li>Tốc độ góc chính là tần số góc <HarmonicMath math="\\omega" />.</li><li>Vị trí góc ban đầu chính là pha ban đầu <HarmonicMath math="\\varphi" />.</li></ul></article>
      <article className="harmonic-formula"><div><span>Mô tả hình chiếu</span><h3>Phương trình dao động điều hòa</h3><p>Vật hình trụ quay đều và quả nặng lò xo được quan sát qua bóng trên cùng một trục.</p></div><aside><HarmonicMath block math="x = A\\cos(\\omega t + \\varphi)" /></aside></article>
    </div>
    <Button type="button" className="harmonic-button--primary" onClick={onContinue}>Chuẩn bị Thí nghiệm →</Button>
  </div></div>;
}
