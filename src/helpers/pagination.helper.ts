import {SortDirection} from "mongodb";
import {Request} from "express";

export const paginationQueries = (req: Request) => {
    const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy: string = req.query.sortBy ? req.query.sortBy : 'createdAt';
    const sortDirection: SortDirection = req.query.sortDirection && req.query.sortDirection === 'asc'
        ? 'asc'
        : 'desc';
    const searchNameTerm: string | null = req.query.searchNameTerm ? req.query.searchNameTerm : null;

    return {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm};
}

export const paginationPostQueries = (req: Request) => {
    const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy: string = req.query.sortBy ? req.query.sortBy : 'createdAt';
    const sortDirection: 'asc' | 'desc' = req.query.sortDirection === 'asc' ? 'asc' : 'desc';

    return { pageNumber, pageSize, sortBy, sortDirection };
};