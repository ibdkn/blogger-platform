import {Request, Response} from "express";
import {blogsRepository} from "./blogs.repository";
import {BlogViewModelType} from "./blogs.types";

export const blogsController = {
    async getBlogs(req: Request, res: Response): Promise<void> {
        const blogs = await blogsRepository.getAllBlogs();
        res.status(200).json(blogs);
    },
    async getBlog(req: Request, res: Response): Promise<void> {
        const blog = await blogsRepository.getBlog(req.params.id);

        if (!blog) {
            res.status(404).json({
                errorsMessages: [{ field: 'id', message: 'Blog not found' }]
            });
            return;
        }

        res.status(200).json(blog);
    },
    async createBlog(req: Request, res: Response): Promise<void> {
        const newBlog = await blogsRepository.createBlog(req.body);
        res.status(201).json(newBlog);
    },
   async updateBlog(req: Request, res: Response): Promise<void> {
       const errors = await blogsRepository.updateBlog(req.params.id, req.body);

       // Если репозиторий вернул ошибки, отправляем 404 с описанием
       if (errors) {
           res.status(404).json({ errorsMessages: errors });
           return;
       }

       // Если всё успешно, отправляем 204
       res.status(204).send();
   },
    async deleteBlog(req: Request, res: Response): Promise<void> {
        const errors= await blogsRepository.deleteBlog(req.params.id);

        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
            return;
        }

        // Если всё успешно, отправляем 204
        res.status(204).send();
    }
}