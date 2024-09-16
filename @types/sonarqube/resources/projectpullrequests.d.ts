export interface ProjectPullRequestListRequest {
  project: string;
}

export interface ProjectPullRequestListResponse {
  pullRequests: ProjectPullRequest[];
}

export interface ProjectPullRequest {
  key: string;
  title: string;
  branch: string;
  base: string;
  status: ProjectPullRequestStatus;
  analysisDate: string;
  url: string;
  target: string;
}

export interface ProjectPullRequestStatus {
  qualityGateStatus: string;
}
