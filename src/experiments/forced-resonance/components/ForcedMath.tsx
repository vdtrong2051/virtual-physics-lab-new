import { BlockMath, InlineMath } from "react-katex";

export default function ForcedMath({ math, block = false }: { math: string; block?: boolean }) {
  return block ? <BlockMath math={math} /> : <InlineMath math={math} />;
}
