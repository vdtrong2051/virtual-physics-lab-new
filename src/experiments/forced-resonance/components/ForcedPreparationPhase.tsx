import Button from "../../../components/ui/Button";
import { forcedEquipment } from "../data";

export default function ForcedPreparationPhase({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return <div className="forced-content"><div className="forced-content__inner">
    <h2>2. Dụng cụ Thực hành</h2>
    <div className="forced-equipment">{forcedEquipment.map((item) => <article key={item.name}><span aria-hidden="true">{item.icon}</span><h3>{item.name}</h3><p>{item.description}</p></article>)}</div>
    <aside className="forced-note"><h3>💡 Cách tiến hành (Dự đoán):</h3><p>Kéo con lắc điều khiển Đ sang một bên rồi thả ra. Thông qua thanh ngang, con lắc Đ sẽ “ép” các con lắc 1, 2, 3 dao động theo. Hãy tự hỏi: Liệu tất cả có dao động không? Con lắc nào sẽ vung cao nhất?</p></aside>
    <div className="forced-actions"><Button type="button" onClick={onBack}>← Quay lại</Button><Button type="button" className="forced-button--primary" onClick={onContinue}>Vào Phòng Thí nghiệm →</Button></div>
  </div></div>;
}
