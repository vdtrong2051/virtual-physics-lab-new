import Button from "../../../components/ui/Button";
import ForcedMath from "./ForcedMath";

export default function ForcedConclusionPhase({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return <div className="forced-content forced-conclusion"><div className="forced-content__inner forced-content__inner--narrow">
    <h2>4. Kết luận</h2>
    <article className="forced-conclusion__card"><p>Qua quan sát thí nghiệm, ta rút ra được các kết luận quan trọng sau đây khi trả lời câu hỏi trong sách giáo khoa:</p><ul>
      <li><strong>Các con lắc khác có dao động không?</strong> Có. Thông qua thanh ngang, con lắc điều khiển Đ đã truyền một lực cưỡng bức tuần hoàn khiến các con lắc 1, 2, 3 đều bị ép dao động theo.</li>
      <li><strong>Con lắc nào dao động mạnh nhất?</strong> Con lắc có chiều dài bằng đúng chiều dài của con lắc điều khiển Đ sẽ dao động với biên độ lớn nhất (mạnh nhất).</li>
      <li><strong>Tại sao?</strong> Vì chu kì dao động của con lắc đơn tỉ lệ thuận với căn bậc hai chiều dài (<ForcedMath math="T = 2\\pi\\sqrt{l/g}" />). Khi <ForcedMath math="l = l_D" /> thì tần số riêng của con lắc bằng đúng tần số của ngoại lực cưỡng bức. Lúc này xảy ra hiện tượng <b>Cộng hưởng</b>.</li>
    </ul></article>
    <div className="forced-actions"><Button type="button" onClick={onBack}>← Thực hành lại</Button><Button type="button" className="forced-button--primary" onClick={onContinue}>Làm bài Tập →</Button></div>
  </div></div>;
}
