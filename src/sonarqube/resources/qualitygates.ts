import { QualityGateProjectStatusRequest, QualityGateProjectStatusResponse } from "@t/sonarqube/resources/qualitygates";
import { AxiosInstance, AxiosResponse } from "axios";

export enum QualityGatesOperator {
  lt = "LT",
  gt = "GT",
}

export default class QualityGates {
  instance: AxiosInstance;

  readonly path = "qualitygates";

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  projectStatus(
    analysisId?: string,
    branch?: string,
    projectId?: string,
    projectKey?: string,
    pullRequest?: string,
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
