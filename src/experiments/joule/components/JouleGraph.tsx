export type JouleTemperaturePoint = {
  timeS: number;
  temperatureC: number;
};

type JouleGraphProps = {
  points: readonly JouleTemperaturePoint[];
};

const VIEWBOX_WIDTH = 520;
const VIEWBOX_HEIGHT = 210;

const PADDING_LEFT = 54;
const PADDING_RIGHT = 18;
const PADDING_TOP = 18;
const PADDING_BOTTOM = 40;

const X_TICK_COUNT = 5;
const Y_TICK_COUNT = 4;

function formatTemperature(value: number) {
  return value.toFixed(3);
}

export default function JouleGraph({
  points,
}: JouleGraphProps) {
  if (points.length < 2) {
    return (
      <div className="joule-graph__empty">
        <span>Đồ thị T - t</span>

        <p>
          Bắt đầu một lần thí nghiệm để theo dõi
          nhiệt độ nước theo thời gian.
        </p>
      </div>
    );
  }

  const maxTime = Math.max(
    1,
    points[points.length - 1]?.timeS ?? 1,
  );

  const temperatures = points.map(
    (point) => point.temperatureC,
  );

  const rawMinTemperature = Math.min(
    ...temperatures,
  );

  const rawMaxTemperature = Math.max(
    ...temperatures,
  );

  const rawTemperatureRange = Math.max(
    0.001,
    rawMaxTemperature - rawMinTemperature,
  );

  const temperaturePadding = Math.max(
    0.002,
    rawTemperatureRange * 0.2,
  );

  const minTemperature =
    rawMinTemperature - temperaturePadding;

  const maxTemperature =
    rawMaxTemperature + temperaturePadding;

  const temperatureRange =
    maxTemperature - minTemperature;

  const plotWidth =
    VIEWBOX_WIDTH -
    PADDING_LEFT -
    PADDING_RIGHT;

  const plotHeight =
    VIEWBOX_HEIGHT -
    PADDING_TOP -
    PADDING_BOTTOM;

  function mapX(timeS: number) {
    return (
      PADDING_LEFT +
      (timeS / maxTime) * plotWidth
    );
  }

  function mapY(
    temperatureC: number,
  ) {
    return (
      PADDING_TOP +
      (
        1 -
        (
          temperatureC -
          minTemperature
        ) /
          temperatureRange
      ) *
        plotHeight
    );
  }

  const path = points
    .map((point, index) => {
      const x = mapX(
        point.timeS,
      );

      const y = mapY(
        point.temperatureC,
      );

      return `${index === 0 ? "M" : "L"} ${x.toFixed(
        2,
      )} ${y.toFixed(2)}`;
    })
    .join(" ");

  const xTicks = Array.from({
    length: X_TICK_COUNT,
  }).map((_, index) => {
    const ratio =
      index /
      (X_TICK_COUNT - 1);

    return {
      value:
        maxTime * ratio,

      x:
        PADDING_LEFT +
        plotWidth * ratio,
    };
  });

  const yTicks = Array.from({
    length: Y_TICK_COUNT,
  }).map((_, index) => {
    const ratio =
      index /
      (Y_TICK_COUNT - 1);

    const value =
      maxTemperature -
      temperatureRange *
        ratio;

    return {
      value,

      y:
        PADDING_TOP +
        plotHeight * ratio,
    };
  });

  const latestPoint =
    points[
      points.length - 1
    ];

  return (
    <div className="joule-graph">
      <svg
        className="joule-graph__svg"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label="Đồ thị nhiệt độ nước theo thời gian"
      >
        <line
          className="joule-graph__axis"
          x1={PADDING_LEFT}
          y1={
            PADDING_TOP +
            plotHeight
          }
          x2={
            PADDING_LEFT +
            plotWidth
          }
          y2={
            PADDING_TOP +
            plotHeight
          }
        />

        <line
          className="joule-graph__axis"
          x1={PADDING_LEFT}
          y1={PADDING_TOP}
          x2={PADDING_LEFT}
          y2={
            PADDING_TOP +
            plotHeight
          }
        />

        {xTicks.map(
          (tick) => (
            <g
              key={`x-${tick.value}`}
            >
              <line
                className="joule-graph__grid"
                x1={tick.x}
                y1={PADDING_TOP}
                x2={tick.x}
                y2={
                  PADDING_TOP +
                  plotHeight
                }
              />

              <text
                className="joule-graph__tick"
                x={tick.x}
                y={
                  PADDING_TOP +
                  plotHeight +
                  18
                }
                textAnchor="middle"
              >
                {tick.value.toFixed(
                  1,
                )}
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
                className="joule-graph__grid"
                x1={PADDING_LEFT}
                y1={tick.y}
                x2={
                  PADDING_LEFT +
                  plotWidth
                }
                y2={tick.y}
              />

              <text
                className="joule-graph__tick"
                x={
                  PADDING_LEFT -
                  8
                }
                y={tick.y + 4}
                textAnchor="end"
              >
                {formatTemperature(
                  tick.value,
                )}
              </text>
            </g>
          ),
        )}

        <path
          className="joule-graph__line"
          d={path}
          fill="none"
        />

        {latestPoint && (
          <circle
            className="joule-graph__point"
            cx={mapX(
              latestPoint.timeS,
            )}
            cy={mapY(
              latestPoint
                .temperatureC,
            )}
            r={4}
          />
        )}

        <text
          className="joule-graph__axis-label"
          x={
            PADDING_LEFT +
            plotWidth / 2
          }
          y={
            VIEWBOX_HEIGHT -
            7
          }
          textAnchor="middle"
        >
          t (s)
        </text>

        <text
          className="joule-graph__axis-label"
          x={15}
          y={
            PADDING_TOP +
            plotHeight / 2
          }
          textAnchor="middle"
          transform={`rotate(-90 15 ${
            PADDING_TOP +
            plotHeight / 2
          })`}
        >
          T (°C)
        </text>
      </svg>

      <div className="joule-graph__summary">
        <span>
          t ={" "}
          {latestPoint?.timeS.toFixed(
            1,
          )}{" "}
          s
        </span>

        <strong>
          T ={" "}
          {latestPoint?.temperatureC.toFixed(
            4,
          )}{" "}
          °C
        </strong>
      </div>
    </div>
  );
}