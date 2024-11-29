import {SortDirection} from "mongodb";
import {Request} from "express";

export const paginationQueries = (req: Request) => {
    const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy: string = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
    const sortDirection: SortDirection = req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
        ? 'asc'
        : 'desc';
    const searchNameTerm: string | null = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null;

    return {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm};
}

export const paginationPostQueries = (req: Request) => {
    const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy: string = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt';
    const sortDirection: SortDirection = req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
        ? 'asc'
        : 'desc';

    return { pageNumber, pageSize, sortBy, sortDirection };
};