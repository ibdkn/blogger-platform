import {SortDirection} from "mongodb";
import {Request} from "express";

export const paginationQueries = (req: Request) => {
    const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pagesSize: number = req.query.pagesSize ? +req.query.pagesSize : 10;
    const sortBy: string = req.query.sortBy ? String(req.query.sortBy) : 'createdAt';
    const sortDirection: SortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc'
        ? 'asc'
        : 'desc';
    const searchNameTerm: string | null = req.query.searchNameTerm ? String(req.query.searchNameTerm) : null;

    return {pageNumber, pagesSize, sortBy, sortDirection, searchNameTerm};
}