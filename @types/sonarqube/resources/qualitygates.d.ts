import { Period } from "@t/sonarqube/period";

export interface QualityGateProjectStatusRequest {
  analysisId?: string;
  branch?: string;
  projectId?: string;
  projectKey?: string;
  pullRequest?: string;
}

export interface QualityGateProjectStatusResponse {
  projectStatus: QualityGateProjectStatus;
}

export interface QualityGateProjectStatus {
  status: string;
  ignoredConditions: boolean;
  caycStatus: string;
  conditions: QualityGateProjectCondition[];
  period: Period;
}

export interface QualityGateProjectCondition {
  status: string;
  metricKey: string;
  comparator: string;
  errorThreshold?: string;
  actualValue: string;
}
