import {SortDirection} from "mongodb";
import {Request} from "express";

export const paginationQueries = (req: Request) => {
    const query = req.query || {};

    const pageNumber: number = +query.pageNumber || 1;
    const pageSize: number = +query.pageSize || 10;
    const sortBy: string = typeof query.sortBy === 'string' ? query.sortBy : 'createdAt';
    const sortDirection: SortDirection =
        query.sortDirection === 'asc' ? 'asc' : 'desc';
    const searchNameTerm: string | null =
        typeof query.searchNameTerm === 'string' ? query.searchNameTerm : null;

    return { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm };
};

export const paginationPostQueries = (req: Request) => {
    const query = req.query || {};

    const pageNumber: number = +query.pageNumber || 1;
    const pageSize: number = +query.pageSize || 10;
    const sortBy: string = typeof query.sortBy === 'string' ? query.sortBy : 'createdAt';
    const sortDirection: SortDirection =
        query.sortDirection === 'asc' ? 'asc' : 'desc';

    return { pageNumber, pageSize, sortBy, sortDirection };
};