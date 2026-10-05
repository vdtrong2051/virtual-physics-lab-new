import {
  dampedPhysicsConfig,
} from "../data";

export type DampedGraphPoint = {
  time: number;
  displacement: number;
  envelope: number;
};

export function calculateDampedDisplacement(
  time: number,
  damping: number,
) {
  return (
    dampedPhysicsConfig.amplitude *
    Math.exp(-damping * time) *
    Math.cos(
      dampedPhysicsConfig.angularFrequency *
        time,
    )
  );
}

export function calculateDampedEnvelope(
  time: number,
  damping: number,
) {
  return (
    dampedPhysicsConfig.amplitude *
    Math.exp(-damping * time)
  );
}

export function createDampedGraphPoints(
  damping: number,
): DampedGraphPoint[] {
  const points: DampedGraphPoint[] = [];

  for (
    let index = 0;
    index <= dampedPhysicsConfig.graphSteps;
    index += 1
  ) {
    const time =
      (index /
        dampedPhysicsConfig.graphSteps) *
      dampedPhysicsConfig.graphMaxTime;

    points.push({
      time,
      displacement:
        calculateDampedDisplacement(
          time,
          damping,
        ),
      envelope:
        calculateDampedEnvelope(
          time,
          damping,
        ),
    });
  }

  return points;
}
