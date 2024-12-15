import {SortDirection} from "mongodb";
import {Request} from "express";

export const paginationQueries = (req: Request) => {
    const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy: string = req.query.sortBy ? String(req.query.sortBy) : 'createdAt';
    const sortDirection: SortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc'
        ? 'asc'
        : 'desc';
    const searchNameTerm: string | null = req.query.searchNameTerm ? String(req.query.searchNameTerm) : null;
    const searchLoginTerm: string | null = req.query.searchLoginTerm ? String(req.query.searchLoginTerm) : null;
    const searchEmailTerm: string | null = req.query.searchEmailTerm ? String(req.query.searchEmailTerm) : null;

    return {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm,
        searchLoginTerm,
        searchEmailTerm
    };
}