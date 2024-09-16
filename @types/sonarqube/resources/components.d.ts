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
