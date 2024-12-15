import {Request, Response} from "express";
import {postsService} from "./posts.service";
import {paginationQueries} from "../helpers/pagination.helper";
import {PaginationType} from "../common/types/pagination.types";
import {PostType, PostViewType} from "./posts.types";
import {postsQueryRepository} from "./posts.query.repository";
import {AppError} from "../common/types/error.types";
import {validateObjectId} from "../helpers/validation.helper";
import {resultCodeToHttpException} from "../common/result/resultCodeToHttpException";
import {ResultStatus} from "../common/result/resultCode";
import {ExtensionType} from "../common/result/result.type";

export const postsController = {
    async getPosts(req: Request, res: Response): Promise<void> {
        try {
            const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueries(req);
            const posts: PaginationType<PostViewType> = await postsQueryRepository
                .getPosts(pageNumber, pageSize, sortBy, sortDirection);

            res.status(resultCodeToHttpException(ResultStatus.Success)).json(posts);
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
    async getPost(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ExtensionType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).json({errorsMessages});
                return;
            }

            const post: PostViewType = await postsQueryRepository.findById(req.params.id);

            res.status(resultCodeToHttpException(ResultStatus.Success)).json(post);        
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
    async getPostsByBlogId(req: Request, res: Response): Promise<void> {
        try {
            const {blogId} = req.params;
            const errorsMessages: ExtensionType[] = validateObjectId(blogId);

            if (errorsMessages.length > 0) {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).json({errorsMessages});
                return;
            }

            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            } = paginationQueries(req);

            const posts: PaginationType<PostViewType> = await postsQueryRepository
                .findAllByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection);

            res.status(resultCodeToHttpException(ResultStatus.Success)).json(posts);
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
    async createPostForSpecificBlog(req: Request, res: Response) {
        try {
            const {blogId} = req.params;
            const errorsMessages: ExtensionType[] = validateObjectId(blogId);

            if (errorsMessages.length > 0) {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).json({errorsMessages});
                return;
            }

            const newPostId: string = await postsService.createForSpecificBlog(blogId, req.body);
            const newPost: PostType = await postsQueryRepository.findById(newPostId);

            res.status(resultCodeToHttpException(ResultStatus.Created)).send(newPost);
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
    async createPost(req: Request, res: Response): Promise<void> {
        try {
            const newPostId: string = await postsService.create(req.body);
            const newPost: PostType = await postsQueryRepository.findById(newPostId);

            res.status(resultCodeToHttpException(ResultStatus.Created)).json(newPost);
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
    async updatePost(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ExtensionType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).json({errorsMessages});
                return;
            }

            await postsService.updatePost(id, req.body);
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
    async deletePost(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ExtensionType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(resultCodeToHttpException(ResultStatus.BadRequest)).json({errorsMessages});
                return;
            }

            await postsService.delete(id);
            res.status(204).send();
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