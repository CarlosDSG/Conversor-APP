
export interface CalculationInputs {
  precioUsd: string;
  tasaDia: string;
  tasaBcv: string;
}

export interface CalculationResults {
  montoBolivares: number;
  montoBcvUsd: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}
