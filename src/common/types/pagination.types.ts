export type PaginatedResult<T> = {
    pagesCount: number,
    page: number
    pageSize: number,
    totalCount: number
    items: T[]
};