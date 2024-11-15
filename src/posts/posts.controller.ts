import {Request, Response} from "express";
import {postsRepository} from "./posts.repository";

export const postsController = {
    getPosts(req: Request, res: Response): void {
        const posts = postsRepository.getAllPosts();
        res.status(200).json(posts);
    },
    getPost(req: Request, res: Response): void {
        const post = postsRepository.getPost(req.params.id);

        if (!post) {
            res.status(404).json({
                errorsMessages: [{field: 'id', message: 'Post not found'}],
            });
        }
        res.status(200).json(post);
    },
    createPost(req: Request, res: Response): void {
        const newPost = postsRepository.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId
        );
        res.status(201).json(newPost);
    },
    updatePost(req: Request, res: Response): void {
        const errors = postsRepository.updatePost(
            req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId
        );

        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
        }

        // Если всё успешно, отправляем 204
        res.status(204).send();
    },
    deletePost(req: Request, res: Response): void {
        const errors = postsRepository.deletePost(req.params.id);

        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
        }

        // Если всё успешно, отправляем 204
        res.status(204).send();
    }
}