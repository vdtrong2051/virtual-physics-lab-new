export type ExperimentLineChartPoint = {
  x: number;
  y: number;
};

export type ExperimentLineChartTick = {
  value: number;
  label: string;
};

export type ExperimentLineChartReferenceLine = {
  x1: number;
  y1: number;

  x2: number;
  y2: number;

  className: string;
};

export type ExperimentLineChartPadding = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type ExperimentLineChartProps = {
  className: string;

  svgClassName?: string;

  width: number;
  height: number;

  padding:
    ExperimentLineChartPadding;

  xDomain: readonly [
    number,
    number,
  ];

  yDomain: readonly [
    number,
    number,
  ];

  xTicks:
    readonly ExperimentLineChartTick[];

  yTicks:
    readonly ExperimentLineChartTick[];

  points:
    readonly ExperimentLineChartPoint[];

  xAxisLabel: string;
  yAxisLabel: string;

  ariaLabel: string;

  tickClassName?: string;

  axisLabelClassName?: string;

  referenceLines?:
    readonly ExperimentLineChartReferenceLine[];

  pointMode?:
    | "all"
    | "last"
    | "none";

  pointRadius?: number;

  xTickOffset?: number;

  yTickOffset?: number;

  xAxisLabelBottom?: number;

  yAxisLabelX?: number;
};

export default function ExperimentLineChart({
  className,
  svgClassName,
  width,
  height,
  padding,
  xDomain,
  yDomain,
  xTicks,
  yTicks,
  points,
  xAxisLabel,
  yAxisLabel,
  ariaLabel,
  tickClassName,
  axisLabelClassName,
  referenceLines = [],
  pointMode = "all",
  pointRadius = 4,
  xTickOffset = 18,
  yTickOffset = 8,
  xAxisLabelBottom = 6,
  yAxisLabelX = 14,
}: ExperimentLineChartProps) {
  const [
    xMin,
    xMax,
  ] = xDomain;

  const [
    yMin,
    yMax,
  ] = yDomain;

  const plotWidth =
    width -
    padding.left -
    padding.right;

  const plotHeight =
    height -
    padding.top -
    padding.bottom;

  const xRange =
    Math.max(
      Number.EPSILON,
      xMax - xMin,
    );

  const yRange =
    Math.max(
      Number.EPSILON,
      yMax - yMin,
    );

  function mapX(
    value: number,
  ) {
    return (
      padding.left +
      (
        (value - xMin) /
        xRange
      ) *
        plotWidth
    );
  }

  function mapY(
    value: number,
  ) {
    return (
      padding.top +
      plotHeight -
      (
        (value - yMin) /
        yRange
      ) *
        plotHeight
    );
  }

  const polylinePoints =
    points
      .map(
        (point) =>
          `${mapX(
            point.x,
          )},${mapY(
            point.y,
          )}`,
      )
      .join(" ");

  const resolvedTickClassName =
    tickClassName ??
    `${className}__tick`;

  const resolvedAxisLabelClassName =
    axisLabelClassName ??
    `${className}__axis-label`;

  const pointsToRender =
    pointMode === "none"
      ? []
      : pointMode === "last"
        ? points.slice(-1)
        : points;

  return (
    <svg
      className={svgClassName}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <line
        x1={padding.left}
        y1={
          padding.top +
          plotHeight
        }
        x2={
          padding.left +
          plotWidth
        }
        y2={
          padding.top +
          plotHeight
        }
        className={`${className}__axis`}
      />

      <line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={
          padding.top +
          plotHeight
        }
        className={`${className}__axis`}
      />

      {xTicks.map(
        (tick) => (
          <g
            key={`x-${tick.value}`}
          >
            <line
              x1={mapX(
                tick.value,
              )}
              y1={padding.top}
              x2={mapX(
                tick.value,
              )}
              y2={
                padding.top +
                plotHeight
              }
              className={`${className}__grid`}
            />

            <text
              x={mapX(
                tick.value,
              )}
              y={
                padding.top +
                plotHeight +
                xTickOffset
              }
              textAnchor="middle"
              className={
                resolvedTickClassName
              }
            >
              {tick.label}
            </text>
          </g>
        ),
      )}

      {yTicks.map(
        (tick) => (
          <g
            key={`y-${tick.value}`}
          >
            <line
              x1={padding.left}
              y1={mapY(
                tick.value,
              )}
              x2={
                padding.left +
                plotWidth
              }
              y2={mapY(
                tick.value,
              )}
              className={`${className}__grid`}
            />

            <text
              x={
                padding.left -
                yTickOffset
              }
              y={
                mapY(
                  tick.value,
                ) + 4
              }
              textAnchor="end"
              className={
                resolvedTickClassName
              }
            >
              {tick.label}
            </text>
          </g>
        ),
      )}

      {referenceLines.map(
        (
          referenceLine,
          index,
        ) => (
          <line
            key={index}
            x1={mapX(
              referenceLine.x1,
            )}
            y1={mapY(
              referenceLine.y1,
            )}
            x2={mapX(
              referenceLine.x2,
            )}
            y2={mapY(
              referenceLine.y2,
            )}
            className={
              referenceLine.className
            }
          />
        ),
      )}

      {points.length > 1 && (
        <polyline
          points={
            polylinePoints
          }
          className={`${className}__line`}
        />
      )}

      {pointsToRender.map(
        (
          point,
          index,
        ) => (
          <circle
            key={`${point.x}-${point.y}-${index}`}
            cx={mapX(
              point.x,
            )}
            cy={mapY(
              point.y,
            )}
            r={pointRadius}
            className={`${className}__point`}
          />
        ),
      )}

      <text
        x={
          padding.left +
          plotWidth / 2
        }
        y={
          height -
          xAxisLabelBottom
        }
        textAnchor="middle"
        className={
          resolvedAxisLabelClassName
        }
      >
        {xAxisLabel}
      </text>

      <text
        x={yAxisLabelX}
        y={
          padding.top +
          plotHeight / 2
        }
        textAnchor="middle"
        transform={`rotate(-90 ${yAxisLabelX} ${
          padding.top +
          plotHeight / 2
        })`}
        className={
          resolvedAxisLabelClassName
        }
      >
        {yAxisLabel}
      </text>
    </svg>
  );
}