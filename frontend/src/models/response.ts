export interface ServerResponse<T> {
  data: T;
  pagination: {
    totalDocuments: number;
    pageSize: number;
    previousPageIndex: null | number;
    nextPageIndex: null | number;
  };
}
