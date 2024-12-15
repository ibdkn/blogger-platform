import {Request, Response} from "express";
import {blogsService} from "./blogs.service";
import {paginationQueries} from "../helpers/pagination.helper";
import {PaginationType} from "../common/types/pagination.types";
import {BlogType, BlogViewModelType} from "./blogs.types";
import {blogsQueryRepository} from "./blogs.query.repository";
import {validateObjectId} from "../helpers/validation.helper";
import {AppError} from "../common/types/error.types";
import {resultCodeToHttpException} from "../common/result/resultCodeToHttpException";
import {ResultStatus} from "../common/result/resultCode";
import {ExtensionType} from "../common/result/result.type";

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

            const blogs: PaginationType<BlogViewModelType> = await blogsQueryRepository
                .findAll(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)

            res.status(resultCodeToHttpException(ResultStatus.Success)).json(blogs);
        } catch (e: any) {
            if (e instanceof AppError) {
                res.status(resultCodeToHttpException(e.status)).send(e.extensions);
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(resultCodeToHttpException(ResultStatus.InternalServerError))
                    .send({message: 'Internal Server Error'});
            }
        }
    },
    async getBlog(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ExtensionType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).json({errorsMessages});
                return;
            }

            const blog: BlogViewModelType = await blogsQueryRepository.findById(id);

            res.status(resultCodeToHttpException(ResultStatus.Success)).json(blog);
        } catch (e: any) {
            if (e instanceof AppError) {
                res.status(resultCodeToHttpException(e.status)).send(e.extensions);
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(resultCodeToHttpException(ResultStatus.InternalServerError))
                    .send({message: 'Internal Server Error'});
            }
        }
    },
    async createBlog(req: Request, res: Response): Promise<void> {
        try {
            const newBlogId: string = await blogsService.create(req.body);
            const newBlog: BlogType = await  blogsQueryRepository.findById(newBlogId);

            res.status(resultCodeToHttpException(ResultStatus.Created)).send(newBlog);
        } catch (e: any) {
            if (e instanceof AppError) {
                res.status(resultCodeToHttpException(e.status)).send(e.extensions);
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(resultCodeToHttpException(ResultStatus.InternalServerError))
                    .send({message: 'Internal Server Error'});
            }
        }
    },
    async updateBlog(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ExtensionType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).json({errorsMessages});
                return;
            }

            await blogsService.updateBlog(id, req.body);
            res.status(resultCodeToHttpException(ResultStatus.NoContent)).send();
        } catch (e: any) {
            if (e instanceof AppError) {
                res.status(resultCodeToHttpException(e.status)).send(e.extensions);
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(resultCodeToHttpException(ResultStatus.InternalServerError))
                    .send({message: 'Internal Server Error'});
            }
        }
    },
    async deleteBlog(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ExtensionType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).json({errorsMessages});
                return;
            }

            await blogsService.deleteBlog(id);
            res.status(resultCodeToHttpException(ResultStatus.NoContent)).send();
        } catch (e: any) {
            if (e instanceof AppError) {
                res.status(resultCodeToHttpException(e.status)).send(e.extensions);
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(resultCodeToHttpException(ResultStatus.InternalServerError))
                    .send({message: 'Internal Server Error'});
            }
        }
    }
}