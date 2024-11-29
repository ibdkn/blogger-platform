import {Request, Response} from "express";
import {postsRepository} from "./posts.repository";
import {paginationPostQueries} from "../helpers/pagination.helper";
import {postsService} from "./posts.service";

export const postsController = {
    async getPosts(req: Request, res: Response): Promise<void> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = paginationPostQueries(req);

        const posts = await postsService.getPosts(pageNumber, pageSize, sortBy, sortDirection);
        res.status(200).json(posts);
    },
    async getPost(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const post = await postsService.getPost(id);

        if (!post) {
            res.status(404).json({
                errorsMessages: [{field: 'id', message: 'Post not found'}],
            });
            return;
        }

        res.status(200).json(post);
    },
    async createPost(req: Request, res: Response): Promise<void> {
        const newPost = await postsService.createPost(req.body);
        res.status(201).json(newPost);
    },
    async updatePost(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const errors = await postsService.updatePost(id, req.body);

        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
            return;
        }

        // Если всё успешно, отправляем 204
        res.status(204).send();
    },
     async deletePost(req: Request, res: Response): Promise<void> {
         const { id } = req.params;

        const errors = await postsService.deletePost(id);

        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
            return;
        }

        // Если всё успешно, отправляем 204
        res.status(204).send();
    }
}