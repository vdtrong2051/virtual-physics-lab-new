import {
  useMemo,
} from "react";

import ExperimentLineChart from "../../../components/experiment/ExperimentLineChart";

import {
  joulePhysicsConfig,
  jouleUnits,
} from "../data";

export type JouleTemperaturePoint = {
  timeS: number;
  temperatureC: number;
};

type JouleGraphProps = {
  points:
    readonly JouleTemperaturePoint[];
};

const CHART_WIDTH = 360;
const CHART_HEIGHT = 220;

const CHART_PADDING = {
  left: 48,
  right: 18,
  top: 18,
  bottom: 38,
} as const;

const DEFAULT_TIME_MAX = 1;

const DEFAULT_TEMPERATURE_PADDING_C =
  0.01;

const AXIS_TICK_COUNT = 4;

function createLinearTicks(
  min: number,
  max: number,
  count: number,
  fractionDigits: number,
) {
  if (
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    count <= 0
  ) {
    return [];
  }

  if (max <= min) {
    return [
      {
        value: min,
        label:
          min.toFixed(
            fractionDigits,
          ),
      },
    ];
  }

  const step =
    (max - min) /
    count;

  return Array.from(
    {
      length:
        count + 1,
    },
    (
      _,
      index,
    ) => {
      const value =
        min +
        step * index;

      return {
        value,
        label:
          value.toFixed(
            fractionDigits,
          ),
      };
    },
  );
}

function getTemperatureFractionDigits(
  range: number,
) {
  if (range < 0.01) {
    return 4;
  }

  if (range < 0.1) {
    return 3;
  }

  if (range < 1) {
    return 2;
  }

  return 1;
}

export default function JouleGraph({
  points,
}: JouleGraphProps) {
  const graphData =
    useMemo(
      () =>
        points
          .map(
            (point) => ({
              x:
                point.timeS,

              y:
                point.temperatureC,
            }),
          )
          .sort(
            (a, b) =>
              a.x - b.x,
          ),
      [points],
    );

  const latestPoint =
    points.length > 0
      ? points[
          points.length - 1
        ]
      : null;

  const graphDomain =
    useMemo(
      () => {
        if (
          points.length === 0
        ) {
          const initialTemperature =
            joulePhysicsConfig
              .initialTemperatureC;

          return {
            xMin: 0,
            xMax:
              DEFAULT_TIME_MAX,

            yMin:
              initialTemperature -
              DEFAULT_TEMPERATURE_PADDING_C,

            yMax:
              initialTemperature +
              DEFAULT_TEMPERATURE_PADDING_C,
          };
        }

        const timeValues =
          points.map(
            (point) =>
              point.timeS,
          );

        const temperatureValues =
          points.map(
            (point) =>
              point.temperatureC,
          );

        const rawTimeMax =
          Math.max(
            ...timeValues,
            DEFAULT_TIME_MAX,
          );

        const rawTemperatureMin =
          Math.min(
            ...temperatureValues,
            joulePhysicsConfig
              .initialTemperatureC,
          );

        const rawTemperatureMax =
          Math.max(
            ...temperatureValues,
            joulePhysicsConfig
              .initialTemperatureC,
          );

        const rawTemperatureRange =
          rawTemperatureMax -
          rawTemperatureMin;

        const temperaturePadding =
          Math.max(
            rawTemperatureRange *
              0.15,

            DEFAULT_TEMPERATURE_PADDING_C,
          );

        return {
          xMin: 0,

          xMax:
            Math.max(
              DEFAULT_TIME_MAX,
              rawTimeMax * 1.05,
            ),

          yMin:
            rawTemperatureMin -
            temperaturePadding,

          yMax:
            rawTemperatureMax +
            temperaturePadding,
        };
      },
      [points],
    );

  const temperatureRange =
    graphDomain.yMax -
    graphDomain.yMin;

  const temperatureFractionDigits =
    getTemperatureFractionDigits(
      temperatureRange,
    );

  const xTicks =
    useMemo(
      () =>
        createLinearTicks(
          graphDomain.xMin,
          graphDomain.xMax,
          AXIS_TICK_COUNT,
          graphDomain.xMax <
            10
            ? 1
            : 0,
        ),
      [
        graphDomain.xMin,
        graphDomain.xMax,
      ],
    );

  const yTicks =
    useMemo(
      () =>
        createLinearTicks(
          graphDomain.yMin,
          graphDomain.yMax,
          AXIS_TICK_COUNT,
          temperatureFractionDigits,
        ),
      [
        graphDomain.yMin,
        graphDomain.yMax,
        temperatureFractionDigits,
      ],
    );

  return (
    <div className="joule-graph">
      {points.length === 0 ? (
        <div className="joule-graph__empty">
          <span>
            Chưa có dữ liệu
          </span>

          <p>
            Bắt đầu thí nghiệm
            để theo dõi sự thay
            đổi nhiệt độ theo
            thời gian.
          </p>
        </div>
      ) : (
        <>
          <ExperimentLineChart
            className="joule-graph"
            svgClassName="joule-graph__svg"
            width={
              CHART_WIDTH
            }
            height={
              CHART_HEIGHT
            }
            padding={
              CHART_PADDING
            }
            xDomain={[
              graphDomain.xMin,
              graphDomain.xMax,
            ]}
            yDomain={[
              graphDomain.yMin,
              graphDomain.yMax,
            ]}
            xTicks={
              xTicks
            }
            yTicks={
              yTicks
            }
            points={
              graphData
            }
            xAxisLabel={`t (${jouleUnits.time})`}
            yAxisLabel={`T (${jouleUnits.temperature})`}
            ariaLabel="Đồ thị nhiệt độ T theo thời gian t trong thí nghiệm Joule"
            tickClassName="joule-graph__tick"
            axisLabelClassName="joule-graph__axis-label"
            pointMode="last"
            pointRadius={4}
            xTickOffset={20}
            yTickOffset={8}
            xAxisLabelBottom={4}
            yAxisLabelX={12}
          />

          <div className="joule-graph__summary">
            <span>
              Thời gian
              {" "}
              <strong>
                {latestPoint
                  ? latestPoint
                      .timeS
                      .toFixed(
                        2,
                      )
                  : "0.00"}
                {" "}
                {
                  jouleUnits
                    .time
                }
              </strong>
            </span>

            <span>
              Nhiệt độ
              {" "}
              <strong>
                {latestPoint
                  ? latestPoint
                      .temperatureC
                      .toFixed(
                        4,
                      )
                  : joulePhysicsConfig
                      .initialTemperatureC
                      .toFixed(
                        4,
                      )}
                {" "}
                {
                  jouleUnits
                    .temperature
                }
              </strong>
            </span>
          </div>
        </>
      )}
    </div>
  );
}