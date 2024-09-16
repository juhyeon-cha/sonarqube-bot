import { ComponentAppRequest, ComponentAppResponse } from "@t/sonarqube/resources/components";
import { AxiosInstance, AxiosResponse } from "axios";

export default class Components {
  instance: AxiosInstance;

  readonly path = "components";

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  app(component: string, branch?: string, pullRequest?: number): Promise<AxiosResponse<ComponentAppResponse, ComponentAppRequest>> {
    return this.instance.get(`${this.path}/app`, {
      params: {
        component,
        branch,
        pullRequest,
      },
    });
  }
}
