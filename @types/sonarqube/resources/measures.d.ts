import { Period } from "@t/sonarqube/period";

export interface MeasureComponentRequest {
  component: string;
  metricKeys: string[];
  additionalFields?: string[];
  branch?: string;
  pullRequest?: number;
}

export interface MeasureComponentResponse {
  component: MeasureComponent;
  metrics: MeasureComponentMetric[];
  period: Period;
}

export interface MeasureComponent {
  key: string;
  name: string;
  qualifier: string;
  language: string;
  path: string;
  measures: MeasureComponentDetail[];
}

export interface MeasureComponentDetail {
  metric: string;
  value?: string;
  period?: MeasurePeriod;
}

export interface MeasurePeriod {
  value: string;
  bestValue: boolean;
}

export interface MeasureComponentMetric {
  key: string;
  name: string;
  description: string;
  domain: string;
  type: string;
  higherValuesAreBetter: boolean;
  qualitative: boolean;
  hidden: boolean;
}
