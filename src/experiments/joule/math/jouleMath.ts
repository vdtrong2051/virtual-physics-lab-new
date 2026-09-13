import type {
  JouleMeasurement,
} from "../model";

export function calculateTotalMass(
  massPerSideKg: number,
): number {
  if (massPerSideKg < 0) {
    throw new RangeError(
      "Mass per side must not be negative.",
    );
  }

  return massPerSideKg * 2;
}

export function calculateMechanicalWork(
  totalMassKg: number,
  dropHeightM: number,
  gravityMPerS2: number,
): number {
  if (totalMassKg < 0) {
    throw new RangeError(
      "Total mass must not be negative.",
    );
  }

  if (dropHeightM < 0) {
    throw new RangeError(
      "Drop height must not be negative.",
    );
  }

  if (gravityMPerS2 <= 0) {
    throw new RangeError(
      "Gravity must be greater than zero.",
    );
  }

  return (
    totalMassKg *
    gravityMPerS2 *
    dropHeightM
  );
}

export function calculateTemperatureRise(
  heatEnergyJ: number,
  waterMassKg: number,
  waterSpecificHeatJPerKgC: number,
): number {
  if (heatEnergyJ < 0) {
    throw new RangeError(
      "Heat energy must not be negative.",
    );
  }

  if (waterMassKg <= 0) {
    throw new RangeError(
      "Water mass must be greater than zero.",
    );
  }

  if (waterSpecificHeatJPerKgC <= 0) {
    throw new RangeError(
      "Water specific heat must be greater than zero.",
    );
  }

  return (
    heatEnergyJ /
    (
      waterMassKg *
      waterSpecificHeatJPerKgC
    )
  );
}

export function createJouleMeasurement(
  massPerSideKg: number,
  dropHeightM: number,
  temperatureRiseC: number,
  gravityMPerS2: number,
): JouleMeasurement {
  if (temperatureRiseC < 0) {
    throw new RangeError(
      "Temperature rise must not be negative.",
    );
  }

  const totalMassKg =
    calculateTotalMass(
      massPerSideKg,
    );

  return {
    totalMassKg,
    dropHeightM,

    mechanicalWorkJ:
      calculateMechanicalWork(
        totalMassKg,
        dropHeightM,
        gravityMPerS2,
      ),

    temperatureRiseC,
  };
}

export function calculateHeatCalories(
  waterMassKg: number,
  waterSpecificHeatCalPerKgC: number,
  temperatureRiseC: number,
): number {
  if (waterMassKg <= 0) {
    throw new RangeError(
      "Water mass must be greater than zero.",
    );
  }

  if (
    waterSpecificHeatCalPerKgC <= 0
  ) {
    throw new RangeError(
      "Water specific heat must be greater than zero.",
    );
  }

  if (temperatureRiseC < 0) {
    throw new RangeError(
      "Temperature rise must not be negative.",
    );
  }

  return (
    waterMassKg *
    waterSpecificHeatCalPerKgC *
    temperatureRiseC
  );
}

export function calculateMechanicalEquivalent(
  mechanicalWorkJ: number,
  heatCalories: number,
): number {
  if (mechanicalWorkJ < 0) {
    throw new RangeError(
      "Mechanical work must not be negative.",
    );
  }

  if (heatCalories <= 0) {
    throw new RangeError(
      "Heat must be greater than zero.",
    );
  }

  return (
    mechanicalWorkJ /
    heatCalories
  );
}

export function calculateAbsoluteError(
  measuredValue: number,
  referenceValue: number,
): number {
  return Math.abs(
    measuredValue -
    referenceValue,
  );
}

export function calculateRelativeErrorPercent(
  measuredValue: number,
  referenceValue: number,
): number | null {
  if (referenceValue === 0) {
    return null;
  }

  return (
    calculateAbsoluteError(
      measuredValue,
      referenceValue,
    ) /
    Math.abs(
      referenceValue,
    )
  ) * 100;
}

export function calculateMeasurementHeatCalories(
  measurement: JouleMeasurement,
  waterMassKg: number,
  waterSpecificHeatCalPerKgC: number,
): number {
  return calculateHeatCalories(
    waterMassKg,
    waterSpecificHeatCalPerKgC,
    measurement.temperatureRiseC,
  );
}

export function calculateMeasurementMechanicalEquivalent(
  measurement: JouleMeasurement,
  gravityMPerS2: number,
  waterMassKg: number,
  waterSpecificHeatCalPerKgC: number,
): number {
  const mechanicalWorkJ =
    calculateMechanicalWork(
      measurement.totalMassKg,
      measurement.dropHeightM,
      gravityMPerS2,
    );

  const heatCalories =
    calculateMeasurementHeatCalories(
      measurement,
      waterMassKg,
      waterSpecificHeatCalPerKgC,
    );

  return calculateMechanicalEquivalent(
    mechanicalWorkJ,
    heatCalories,
  );
}

export function calculateMeanMechanicalEquivalent(
  measurements:
    readonly JouleMeasurement[],
  gravityMPerS2: number,
  waterMassKg: number,
  waterSpecificHeatCalPerKgC: number,
): number | null {
  if (
    measurements.length === 0
  ) {
    return null;
  }

  const total =
    measurements.reduce(
      (
        sum,
        measurement,
      ) =>
        sum +
        calculateMeasurementMechanicalEquivalent(
          measurement,
          gravityMPerS2,
          waterMassKg,
          waterSpecificHeatCalPerKgC,
        ),
      0,
    );

  return (
    total /
    measurements.length
  );
}