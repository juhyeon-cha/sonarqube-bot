import { PagingResponse } from "@t/sonarqube/paging";

export interface ProjectSearchRequest {
  analyzedBefore?: string;
  projects?: string[];
  q?: string;
  onProvisionedOnly?: boolean;
  p?: number;
  ps?: number;
}

export interface ProjectSearchResponse extends PagingResponse {
  components: Project[];
}

export interface Project {
  key: string;
  name: string;
  qualifier: string;
  visibility: string;
  lastAnalysisDate: string;
  revision: string;
  managed: boolean;
}
