export interface Paging {
  pageIndex: number;
  pageSize: number;
  total: number;
}

export interface PagingResponse {
  paging: Paging;
}
