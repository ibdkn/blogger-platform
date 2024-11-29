import {SortDirection} from "mongodb";
import {Request} from "express";

export const paginationQueries = (req: Request) => {
    const pageNumber: number = +req.query.pageNumber || 1;
    const pageSize: number = +req.query.pageSize || 10;
    const sortBy: string = typeof req.query.sortBy === 'string' ? req.query.sortBy : 'createdAt';
    const sortDirection: SortDirection =
        req.query.sortDirection === 'asc' ? 'asc' : 'desc';
    const searchNameTerm: string | null =
        typeof req.query.searchNameTerm === 'string' ? req.query.searchNameTerm : null;

    return { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm };
};

export const paginationPostQueries = (req: Request) => {
    const pageNumber: number = +req.query.pageNumber || 1;
    const pageSize: number = +req.query.pageSize || 10;
    const sortBy: string = typeof req.query.sortBy === 'string' ? req.query.sortBy : 'createdAt';
    const sortDirection: SortDirection =
        req.query.sortDirection === 'asc' ? 'asc' : 'desc';

    return { pageNumber, pageSize, sortBy, sortDirection };
};