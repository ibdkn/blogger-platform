import {Request, Response} from "express";
import {blogsRepository} from "./blogs.repository";
import {BlogType} from "./blogs.types";

export const blogsController = {
    getBlogs(req: Request, res: Response): void {
        const blogs: BlogType[] = blogsRepository.getAllBlogs();
        res.status(200).json(blogs);
    },
    getBlog(req: Request<{ id: string }>, res: Response) {
        const blog = blogsRepository.getBlog(req.params.id);

        if (!blog) {
            res.status(404).json({
                errorsMessages: [{ field: 'id', message: 'Blog not found' }],
            });
        }

        res.status(200).json(blog);
    },
    createBlog(req: Request, res: Response) {
        const newBlog = blogsRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
        res.status(201).json(newBlog);
    },
    updateBlog(req: Request<{ id: string }>, res: Response) {
        const errors = blogsRepository.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);

        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
        }

        // Если всё успешно, отправляем 204
        res.status(204).send();
    },
    deleteBlog(req: Request<{ id: string }>, res: Response) {
        const errors = blogsRepository.deleteBlog(req.params.id);

        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
        }

        // Если всё успешно, отправляем 204
        res.status(204).send();
    }
}