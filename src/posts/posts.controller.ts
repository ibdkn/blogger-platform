import {Request, Response} from "express";
import {postsService} from "./posts.service";
import {paginationQueries} from "../helpers/pagination.helper";
import {PaginatedResult} from "../common/types/pagination.types";
import {PostViewModelType} from "./posts.types";

export const postsController = {
    async getPosts(req: Request, res: Response): Promise<void> {
        try {
            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            } = paginationQueries(req);

            const posts: PaginatedResult<PostViewModelType> = await postsService.getPosts(pageNumber, pageSize, sortBy, sortDirection);
            res.status(200).json(posts);
        } catch (e: any) {
            console.error('Error occurred while fetching posts:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getPost(req: Request, res: Response): Promise<void> {
        try {
            const post = await postsService.getPost(req.params.id);

            res.status(200).json(post);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async createPost(req: Request, res: Response): Promise<void> {
        try {
            const newPost: PostViewModelType = await postsService.createPost(req.body);
            res.status(201).json(newPost);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async updatePost(req: Request, res: Response): Promise<void> {
        try {
            await postsService.updatePost(req.params.id, req.body);
            res.status(204).send();
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                console.error('Error occurred while fetching posts:', e);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
     async deletePost(req: Request, res: Response): Promise<void> {
         try {
             await postsService.deletePost(req.params.id);
             res.status(204).send();
         } catch (e: any) {
             if (e.status) {
                 res.status(e.status).json({ errorsMessages: e.errorsMessages });
             } else {
                 console.error('Error occurred while fetching posts:', e);
                 res.status(500).json({ message: 'Internal server error' });
             }
         }
    }
}