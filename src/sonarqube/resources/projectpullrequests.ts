import { ProjectPullRequestListRequest, ProjectPullRequestListResponse } from "@t/sonarqube/resources/projectpullrequests";
import { AxiosInstance, AxiosResponse } from "axios";

export default class ProjectPullRequests {
  instance: AxiosInstance;

  readonly path = "/api/project_pull_requests";

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  list(project: string): Promise<AxiosResponse<ProjectPullRequestListResponse, ProjectPullRequestListRequest>> {
    return this.instance.get(`${this.path}/list`, { params: { project } });
  }
}
