export interface ComponentAppRequest {
  component: string;
  branch?: string;
  pullRequest?: number;
}

export interface ComponentAppResponse {
  key: string;
  uuid: string;
  name: string;
  longName: string;
  q: string;
  project: string;
  projectName: string;
  fav: boolean;
  canMarkAsFavorite: boolean;
  canCreateManualIssue: boolean;
  measures: ComponentAppMeasures;
}

export interface ComponentAppMeasures {
  lines: string;
  duplicationDensity: string;
  issues: string;
  debt: string;
  sqaleRating: string;
  debtRatio: string;
}

export interface ComponentSearchProjectsRequest {
  asc: string;
  f?: string;
  facets?: string;
  filter?: string;
  p: number;
  ps: number;
  s: string;
}

export interface ComponentSearchProjectsResponse extends PagingResponse {
  components: ComponentProjects[];
}

export interface ComponentProjects {
  key: string;
  name: string;
  qualifier: string;
  isFavorite: boolean;
  tags: string[];
  visibility: string;
}
