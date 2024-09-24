import { QualityGateProjectStatusRequest, QualityGateProjectStatusResponse } from "@t/sonarqube/resources/qualitygates";
import { AxiosInstance, AxiosResponse } from "axios";

export enum QualityGatesOperator {
  lt = "LT",
  gt = "GT",
}

export default class QualityGates {
  instance: AxiosInstance;

  readonly path = "/api/qualitygates";

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  projectStatus(
    projectKey?: string,
    pullRequest?: number,
    analysisId?: string,
    branch?: string,
    projectId?: string,
  ): Promise<AxiosResponse<QualityGateProjectStatusResponse, QualityGateProjectStatusRequest>> {
    return this.instance.get(`${this.path}/project_status`, {
      params: {
        analysisId,
        branch,
        projectId,
        projectKey,
        pullRequest,
      },
    });
  }
}
