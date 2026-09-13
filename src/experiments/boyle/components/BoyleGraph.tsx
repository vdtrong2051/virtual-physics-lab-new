import { useMemo } from "react";

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

const PADDING_LEFT = 44;
const PADDING_RIGHT = 18;
const PADDING_TOP = 18;
const PADDING_BOTTOM = 38;

const X_MAX = 0.8;
const Y_MAX = 2.5;

export default function BoyleGraph({
  measurements,
}: BoyleGraphProps) {
  const graphData = useMemo(
    () =>
      measurements
        .map((measurement) => ({
          inverseVolume:
            calculateInverseVolume(
              measurement.volume,
            ),

          pressure:
            measurement.pressure,
        }))
        .sort(
          (a, b) =>
            a.inverseVolume -
            b.inverseVolume,
        ),
    [measurements],
  );

  const plotWidth =
    CHART_WIDTH -
    PADDING_LEFT -
    PADDING_RIGHT;

  const plotHeight =
    CHART_HEIGHT -
    PADDING_TOP -
    PADDING_BOTTOM;

  function mapX(
    inverseVolume: number,
  ) {
    return (
      PADDING_LEFT +
      (inverseVolume / X_MAX) *
        plotWidth
    );
  }

  function mapY(
    pressure: number,
  ) {
    return (
      PADDING_TOP +
      plotHeight -
      (pressure / Y_MAX) *
        plotHeight
    );
  }

  const measuredPolyline =
    graphData
      .map(
        (point) =>
          `${mapX(
            point.inverseVolume,
          )},${mapY(
            point.pressure,
          )}`,
      )
      .join(" ");

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
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            role="img"
            aria-label="Đồ thị áp suất p theo nghịch đảo thể tích 1 trên V"
          >
            <line
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
              className="boyle-graph__axis"
            />

            <line
              x1={PADDING_LEFT}
              y1={PADDING_TOP}
              x2={PADDING_LEFT}
              y2={
                PADDING_TOP +
                plotHeight
              }
              className="boyle-graph__axis"
            />

            {[0.5, 1, 1.5, 2].map(
              (pressure) => (
                <g key={pressure}>
                  <line
                    x1={PADDING_LEFT}
                    y1={mapY(
                      pressure,
                    )}
                    x2={
                      PADDING_LEFT +
                      plotWidth
                    }
                    y2={mapY(
                      pressure,
                    )}
                    className="boyle-graph__grid"
                  />

                  <text
                    x={
                      PADDING_LEFT -
                      8
                    }
                    y={
                      mapY(
                        pressure,
                      ) + 4
                    }
                    textAnchor="end"
                    className="boyle-graph__label"
                  >
                    {pressure}
                  </text>
                </g>
              ),
            )}

            {[0.25, 0.5, 0.75].map(
              (inverseVolume) => (
                <g
                  key={
                    inverseVolume
                  }
                >
                  <line
                    x1={mapX(
                      inverseVolume,
                    )}
                    y1={PADDING_TOP}
                    x2={mapX(
                      inverseVolume,
                    )}
                    y2={
                      PADDING_TOP +
                      plotHeight
                    }
                    className="boyle-graph__grid"
                  />

                  <text
                    x={mapX(
                      inverseVolume,
                    )}
                    y={
                      PADDING_TOP +
                      plotHeight +
                      20
                    }
                    textAnchor="middle"
                    className="boyle-graph__label"
                  >
                    {inverseVolume}
                  </text>
                </g>
              ),
            )}

            <line
              x1={mapX(
                idealStartInverseVolume,
              )}
              y1={mapY(
                idealStartPressure,
              )}
              x2={mapX(
                idealEndInverseVolume,
              )}
              y2={mapY(
                idealEndPressure,
              )}
              className="boyle-graph__ideal"
            />

            {graphData.length > 1 && (
              <polyline
                points={
                  measuredPolyline
                }
                className="boyle-graph__line"
              />
            )}

            {graphData.map(
              (
                point,
                index,
              ) => (
                <circle
                  key={`${point.inverseVolume}-${index}`}
                  cx={mapX(
                    point.inverseVolume,
                  )}
                  cy={mapY(
                    point.pressure,
                  )}
                  r="4"
                  className="boyle-graph__point"
                />
              ),
            )}

            <text
              x={
                PADDING_LEFT +
                plotWidth / 2
              }
              y={
                CHART_HEIGHT - 4
              }
              textAnchor="middle"
              className="boyle-graph__axis-title"
            >
              1/V ({boyleUnits.inverseVolume})
            </text>

            <text
              x="12"
              y={
                PADDING_TOP +
                plotHeight / 2
              }
              textAnchor="middle"
              transform={`rotate(-90 12 ${
                PADDING_TOP +
                plotHeight / 2
              })`}
              className="boyle-graph__axis-title"
            >
              p ({boyleUnits.pressure})
            </text>
          </svg>
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