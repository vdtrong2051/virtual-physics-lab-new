import {
  useMemo,
} from "react";

import {
  dampedPhysicsConfig,
} from "../data";

import {
  createDampedGraphPoints,
} from "../math/dampedMath";

type DampedGraphProps = {
  damping: number;
};

const width = 500;
const height = 180;
const padding = 20;

export default function DampedGraph({
  damping,
}: DampedGraphProps) {
  const graphPaths = useMemo(() => {
    const points =
      createDampedGraphPoints(damping);

    function mapX(time: number) {
      return (
        padding +
        (time /
          dampedPhysicsConfig.graphMaxTime) *
          (width - 2 * padding)
      );
    }

    function mapY(value: number) {
      return (
        height / 2 -
        (value /
          dampedPhysicsConfig.amplitude) *
          ((height - 2 * padding) / 2)
      );
    }

    return {
      displacement: points
        .map(
          (point) =>
            `${mapX(point.time)},${mapY(
              point.displacement,
            )}`,
        )
        .join(" "),
      envelopeTop: points
        .map(
          (point) =>
            `${mapX(point.time)},${mapY(
              point.envelope,
            )}`,
        )
        .join(" "),
      envelopeBottom: points
        .map(
          (point) =>
            `${mapX(point.time)},${mapY(
              -point.envelope,
            )}`,
        )
        .join(" "),
    };
  }, [damping]);

  return (
    <div className="damped-graph">
      <span className="damped-graph__label">
        Đồ thị 2D trục chuẩn
      </span>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Đồ thị dao động tắt dần với hệ số lực cản ${damping.toFixed(2)}`}
      >
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          className="damped-graph__axis damped-graph__axis--vertical"
        />

        <line
          x1={padding}
          y1={height / 2}
          x2={width - padding}
          y2={height / 2}
          className="damped-graph__axis"
        />

        <polyline
          points={graphPaths.envelopeTop}
          className="damped-graph__envelope"
        />

        <polyline
          points={graphPaths.envelopeBottom}
          className="damped-graph__envelope"
        />

        <polyline
          points={graphPaths.displacement}
          className="damped-graph__line"
        />
      </svg>
    </div>
  );
}
