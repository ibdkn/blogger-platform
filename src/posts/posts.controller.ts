import {Request, Response} from "express";
import {postsService} from "./posts.service";
import {paginationQueries} from "../helpers/pagination.helper";
import {PaginationType} from "../common/types/pagination.types";
import {PostViewModelType} from "./posts.types";
import {postsQueryRepository} from "./posts.query.repository";
import {DomainError, ValidationErrorType} from "../common/types/error.types";
import {validateObjectId} from "../helpers/validation.helper";

export const postsController = {
    async getPosts(req: Request, res: Response): Promise<void> {
        try {
            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            } = paginationQueries(req);

            const posts: PaginationType<PostViewModelType> = await postsQueryRepository.getPosts(pageNumber, pageSize,
                sortBy, sortDirection);

            res.status(200).json(posts);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({errorsMessages: e.errorsMessages});
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    },
    async getPost(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ValidationErrorType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(400).json({ errorsMessages });
                return;
            }

            const post: PostViewModelType = await postsQueryRepository.getPost(req.params.id);

            res.status(200).json(post);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({errorsMessages: e.errorsMessages});
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    },
    async getPostsByBlogId(req: Request, res: Response): Promise<void> {
        try {
            const {blogId} = req.params;
            const errorsMessages: ValidationErrorType[] = validateObjectId(blogId);

            if (errorsMessages.length > 0) {
                res.status(400).json({ errorsMessages });
                return;
            }

            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            } = paginationQueries(req);

            const posts: PaginationType<PostViewModelType> = await postsQueryRepository.getPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection);

            res.status(200).json(posts);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({errorsMessages: e.errorsMessages});
            } else {
                res.status(500).json({message: 'Internal server error'});
            }
        }
    },
    async createPostForSpecificBlog(req: Request, res: Response) {
        try {
            const {blogId} = req.params;
            const errorsMessages: ValidationErrorType[] = validateObjectId(blogId);

            if (errorsMessages.length > 0) {
                res.status(400).json({ errorsMessages });
                return;
            }

            const newPost = await postsService.createPostForSpecificBlog(blogId, req.body);

            res.status(201).json(newPost);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({errorsMessages: e.errorsMessages});
            } else {
                res.status(500).json({message: 'Internal server error'});
            }
        }
    },
    async createPost(req: Request, res: Response): Promise<void> {
        try {
            const newPost: PostViewModelType = await postsService.createPost(req.body);
            res.status(201).json(newPost);
        } catch (e: any) {
            if (e instanceof DomainError) {
                res.status(e.status).json({ errorsMessages: e.errorMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    },
    async updatePost(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ValidationErrorType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(400).json({ errorsMessages });
                return;
            }

            await postsService.updatePost(id, req.body);
            res.status(204).send();
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({errorsMessages: e.errorsMessages});
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    },
    async deletePost(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const errorsMessages: ValidationErrorType[] = validateObjectId(id);

            if (errorsMessages.length > 0) {
                res.status(400).json({ errorsMessages });
                return;
            }

            await postsService.deletePost(id);
            res.status(204).send();
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({errorsMessages: e.errorsMessages});
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    }
}