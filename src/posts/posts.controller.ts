import {Request, Response} from "express";
import {postsRepository} from "./posts.repository";

export const postsController = {
    async getPosts(req: Request, res: Response): Promise<void> {
        const posts = await postsRepository.getAllPosts();
        res.status(200).json(posts);
    },
    async getPost(req: Request, res: Response): Promise<void> {
        const post = await postsRepository.getPost(req.params.id);

        if (!post) {
            res.status(404).json({
                errorsMessages: [{field: 'id', message: 'Post not found'}],
            });
            return;
        }
        res.status(200).json(post);
    },
    async createPost(req: Request, res: Response): Promise<void> {
        const newPost = await postsRepository.createPost(req.body);
        res.status(201).json(newPost);
    },
    async updatePost(req: Request, res: Response): Promise<void> {
        const errors = await postsRepository.updatePost(req.params.id, req.body);

        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
            return;
        }

        // Если всё успешно, отправляем 204
        res.status(204).send();
    },
     async deletePost(req: Request, res: Response): Promise<void> {
        const errors = await postsRepository.deletePost(req.params.id);

        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
            return;
        }

        // Если всё успешно, отправляем 204
        res.status(204).send();
    }
}