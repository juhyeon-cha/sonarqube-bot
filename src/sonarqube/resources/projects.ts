import { ProjectSearchRequest, ProjectSearchResponse } from "@t/sonarqube/resources/projects";
import { AxiosInstance, AxiosResponse } from "axios";

export enum ProjectsVisibility {
  private = "private",
  public = "public",
}

export default class Projects {
  instance: AxiosInstance;

  readonly path = "projects";

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  search(
    q?: string,
    analyzedBefore?: string,
    projects?: string[],
    onProvisionedOnly = false,
    p = 1,
    ps = 100,
  ): Promise<AxiosResponse<ProjectSearchResponse, ProjectSearchRequest>> {
    return this.instance.get(`${this.path}/search`, {
      params: {
        analyzedBefore,
        projects: typeof projects !== "undefined" && projects.length > 0 ? projects.join(",") : undefined,
        q,
        onProvisionedOnly,
        p,
        ps,
      },
    });
  }
}
