import {Request, Response} from "express";
import {blogsService} from "./blogs.service";
import {paginationQueries} from "../helpers/pagination.helper";
import {PaginationType} from "../common/types/pagination.types";
import {BlogType, BlogViewModelType} from "./blogs.types";
import {blogsQueryRepository} from "./blogs.query.repository";
import {validateObjectId} from "../helpers/validation.helper";
import {ValidationErrorType} from "../common/types/error.types";

export const blogsController = {
    async getBlogs(req: Request, res: Response): Promise<void> {
        try {
            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                searchNameTerm,
            } = paginationQueries(req);

            const blogs: PaginationType<BlogViewModelType> = await blogsQueryRepository.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)

            res.status(200).json(blogs);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async getBlog(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ValidationErrorType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(400).json({ errorsMessages });
                return;
            }

            const blog: BlogViewModelType = await blogsQueryRepository.getBlog(id);

            res.status(200).json(blog);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async createBlog(req: Request, res: Response): Promise<void> {
        try {
            const newBlog: BlogType = await blogsService.createBlog(req.body);

            res.status(201).json(newBlog);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async updateBlog(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ValidationErrorType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(400).json({ errorsMessages });
                return;
            }

            await blogsService.updateBlog(id, req.body);

            res.status(204).send();
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async deleteBlog(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ValidationErrorType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(400).json({ errorsMessages });
                return;
            }

            await blogsService.deleteBlog(id);

            res.status(204).send();
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}