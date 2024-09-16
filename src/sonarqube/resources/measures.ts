import { AxiosInstance, AxiosResponse } from "axios";
import * as SonarDefinition from "../../../@types/sonarqube/enums";
import { MeasureComponentRequest, MeasureComponentResponse } from "@t/sonarqube/resources/measures";

export enum MeasuresAdditionalFields {
  metrics = "metrics",
  periods = "periods",
}

export enum MeasuresMetricSortFilter {
  all = "all",
  withMeasuresOnly = "withMeasuresOnly",
}

export default class Measures {
  instance: AxiosInstance;

  readonly path = "measures";

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  component(
    component: string,
    metricKeys: SonarDefinition.SonarMetricKey[],
    additionalFields?: MeasuresAdditionalFields[],
    branch?: string,
    pullRequest?: number,
  ): Promise<AxiosResponse<MeasureComponentResponse, MeasureComponentRequest>> {
    const params: {
      component: string;
      metricKeys: string;
      additionalFields?: string;
      branch?: string;
      pullRequest?: number;
    } = {
      component,
      metricKeys: metricKeys.join(","),
      branch,
      pullRequest,
    };
    if (typeof additionalFields !== "undefined" && additionalFields.length > 0) {
      params.additionalFields = additionalFields.join(",");
    }
    return this.instance.get(`${this.path}/component`, { params });
  }
}
