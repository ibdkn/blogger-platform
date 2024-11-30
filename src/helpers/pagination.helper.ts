import {SortDirection} from "mongodb";
import {Request} from "express";

export const paginationQueries = (req: Request) => {
    const query = req.query || {}; // Защита от undefined

    const pageNumber: number = query.pageNumber && query.pageNumber !== 'null' ? +query.pageNumber : 1;
    const pageSize: number = query.pageSize && query.pageSize !== 'null' ? +query.pageSize : 10;
    const sortBy: string = query.sortBy && query.sortBy !== 'null' ? query.sortBy.toString() : 'createdAt';
    const sortDirection: 'asc' | 'desc' =
        query.sortDirection && query.sortDirection !== 'null' && query.sortDirection.toString() === 'asc'
            ? 'asc'
            : 'desc';
    const searchNameTerm: string | null =
        query.searchNameTerm && query.searchNameTerm !== 'null' ? query.searchNameTerm.toString() : null;

    console.log("Query params:", query);
    console.log("Parsed query params:", { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm });

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