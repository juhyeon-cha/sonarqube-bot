import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import * as Resources from "./resources/index";
export { Resources };

export interface SonarConfig extends AxiosRequestConfig {
  auth: {
    username: string;
    password: string;
  };
  baseURL: string;
}

export class Sonar {
  instance: AxiosInstance;

  components: Resources.Components;

  measures: Resources.Measures;

  projectPullRequests: Resources.ProjectPullRequests;

  projects: Resources.Projects;

  qualityGates: Resources.QualityGates;

  constructor(config: SonarConfig) {
    this.instance = axios.create(config);
    this.components = new Resources.Components(this.instance);
    this.measures = new Resources.Measures(this.instance);
    this.projectPullRequests = new Resources.ProjectPullRequests(this.instance);
    this.projects = new Resources.Projects(this.instance);
    this.qualityGates = new Resources.QualityGates(this.instance);
  }
}
