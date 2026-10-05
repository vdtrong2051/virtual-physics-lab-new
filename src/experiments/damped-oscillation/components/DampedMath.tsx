import katex from "katex";

type DampedMathProps = {
  math: string;
  block?: boolean;
};

export default function DampedMath({
  math,
  block = false,
}: DampedMathProps) {
  const html = katex.renderToString(
    math,
    {
      displayMode: block,
      throwOnError: false,
      output: "html",
    },
  );

  const Element = block ? "div" : "span";

  return (
    <Element
      className={
        block
          ? "damped-math damped-math--block"
          : "damped-math"
      }
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
