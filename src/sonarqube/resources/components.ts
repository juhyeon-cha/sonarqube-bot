import { ComponentAppRequest, ComponentAppResponse, ComponentSearchProjectsRequest, ComponentSearchProjectsResponse } from "@t/sonarqube/resources/components";
import { AxiosInstance, AxiosResponse } from "axios";

export default class Components {
  instance: AxiosInstance;

  readonly path = "/api/components";

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

  searchProjects(
    filter?: string,
    f?: string,
    facets?: string,
    asc: string = "true",
    p: number = 1,
    ps: number = 100,
    s: string = "name",
  ): Promise<AxiosResponse<ComponentSearchProjectsResponse, ComponentSearchProjectsRequest>> {
    return this.instance.get(`${this.path}/search_projects`, {
      params: {
        asc,
        f,
        facets,
        filter,
        p,
        ps,
        s,
      },
    });
  }
}
