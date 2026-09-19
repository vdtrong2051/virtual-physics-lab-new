import {
  useMemo,
} from "react";

import ExperimentLineChart from "../../../components/experiment/ExperimentLineChart";

import {
  boylePhysicsConfig,
  boyleUnits,
} from "../data";

import {
  calculateInverseVolume,
  calculateMaxPressureVolumeDeviationPercent,
  calculateMeanPressureVolume,
} from "../math/boyleMath";

import type {
  BoyleMeasurement,
} from "../model";

type BoyleGraphProps = {
  measurements:
    readonly BoyleMeasurement[];
};

const CHART_WIDTH = 360;
const CHART_HEIGHT = 220;

const CHART_PADDING = {
  left: 44,
  right: 18,
  top: 18,
  bottom: 38,
} as const;

const X_MAX = 0.8;
const Y_MAX = 2.5;

const X_TICKS = [
  {
    value: 0.25,
    label: "0.25",
  },
  {
    value: 0.5,
    label: "0.5",
  },
  {
    value: 0.75,
    label: "0.75",
  },
] as const;

const Y_TICKS = [
  {
    value: 0.5,
    label: "0.5",
  },
  {
    value: 1,
    label: "1",
  },
  {
    value: 1.5,
    label: "1.5",
  },
  {
    value: 2,
    label: "2",
  },
] as const;

export default function BoyleGraph({
  measurements,
}: BoyleGraphProps) {
  const graphData = useMemo(
    () =>
      measurements
        .map((measurement) => ({
          x:
            calculateInverseVolume(
              measurement.volume,
            ),

          y:
            measurement.pressure,
        }))
        .sort(
          (a, b) =>
            a.x - b.x,
        ),
    [measurements],
  );

  const idealStartInverseVolume =
    calculateInverseVolume(
      boylePhysicsConfig.volumeMax,
    );

  const idealEndInverseVolume =
    calculateInverseVolume(
      boylePhysicsConfig.volumeMin,
    );

  const idealStartPressure =
    boylePhysicsConfig.boyleConstant *
    idealStartInverseVolume;

  const idealEndPressure =
    boylePhysicsConfig.boyleConstant *
    idealEndInverseVolume;

  const meanPressureVolume =
    calculateMeanPressureVolume(
      measurements,
    );

  const maxDeviationPercent =
    calculateMaxPressureVolumeDeviationPercent(
      measurements,
      boylePhysicsConfig.boyleConstant,
    );

  return (
    <section className="boyle-graph">
      <div className="boyle-graph__header">
        <div>
          <span className="boyle-practice-panel__eyebrow">
            Phân tích dữ liệu
          </span>

          <h3>
            Đồ thị p theo 1/V
          </h3>
        </div>

        <span className="boyle-graph__count">
          {measurements.length} điểm
        </span>
      </div>

      {measurements.length === 0 ? (
        <div className="boyle-graph__empty">
          Ghi ít nhất một lần đo để bắt đầu
          dựng đồ thị.
        </div>
      ) : (
        <div className="boyle-graph__chart">
          <ExperimentLineChart
            className="boyle-graph"
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
              0,
              X_MAX,
            ]}
            yDomain={[
              0,
              Y_MAX,
            ]}
            xTicks={
              X_TICKS
            }
            yTicks={
              Y_TICKS
            }
            points={
              graphData
            }
            xAxisLabel={`1/V (${boyleUnits.inverseVolume})`}
            yAxisLabel={`p (${boyleUnits.pressure})`}
            ariaLabel="Đồ thị áp suất p theo nghịch đảo thể tích 1 trên V"
            tickClassName="boyle-graph__label"
            axisLabelClassName="boyle-graph__axis-title"
            pointMode="all"
            pointRadius={4}
            xTickOffset={20}
            yTickOffset={8}
            xAxisLabelBottom={4}
            yAxisLabelX={12}
            referenceLines={[
              {
                x1:
                  idealStartInverseVolume,

                y1:
                  idealStartPressure,

                x2:
                  idealEndInverseVolume,

                y2:
                  idealEndPressure,

                className:
                  "boyle-graph__ideal",
              },
            ]}
          />
        </div>
      )}

      <div className="boyle-result">
        <div className="boyle-result__item">
          <span>
            pV trung bình
          </span>

          <strong>
            {meanPressureVolume === null
              ? "Chưa có số liệu"
              : `${meanPressureVolume.toFixed(
                  3,
                )} ${
                  boyleUnits.pressureVolume
                }`}
          </strong>
        </div>

        <div className="boyle-result__item">
          <span>
            Độ lệch lớn nhất so với k
          </span>

          <strong>
            {maxDeviationPercent ===
            null
              ? "Chưa có số liệu"
              : `${maxDeviationPercent.toFixed(
                  2,
                )}%`}
          </strong>
        </div>

        <div className="boyle-result__item">
          <span>
            Số điểm đo
          </span>

          <strong>
            {measurements.length}
            {" / "}
            {
              boylePhysicsConfig
                .targetMeasurementCount
            }
          </strong>
        </div>
      </div>
    </section>
  );
}