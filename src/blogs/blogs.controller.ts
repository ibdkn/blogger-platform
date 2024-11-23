import {Request, Response} from "express";
import {blogsRepository} from "./blogs.repository";
import {BlogViewModelType} from "./blogs.types";
import {ObjectId} from "mongodb";

export const blogsController = {
    async getBlogs(req: Request, res: Response): Promise<void> {
        const blogs = await blogsRepository.getAllBlogs();
        res.status(200).json(blogs);
    },
    async getBlog(req: Request, res: Response): Promise<void> {
        const blogId = req.params.id;

        // Проверяем валидность ObjectId
        if (!ObjectId.isValid(blogId)) {
            res.status(400).json({
                errorsMessages: [{ field: 'id', message: 'Invalid ObjectId' }],
            });
            return;
        }

        const blog = await blogsRepository.getBlog(blogId);

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
       const blogId = req.params.id;

       // Проверяем валидность ObjectId
       if (!ObjectId.isValid(blogId)) {
           res.status(400).json({
               errorsMessages: [{ field: 'id', message: 'Invalid ObjectId' }],
           });
           return;
       }

       const errors = await blogsRepository.updateBlog(blogId, req.body);

       // Если репозиторий вернул ошибки, отправляем 404 с описанием
       if (errors) {
           res.status(404).json({ errorsMessages: errors });
           return;
       }

       // Если всё успешно, отправляем 204
       res.status(204).send();
   },
    async deleteBlog(req: Request, res: Response): Promise<void> {
        const blogId = req.params.id;

        // Проверяем валидность ObjectId
        if (!ObjectId.isValid(blogId)) {
            res.status(400).json({
                errorsMessages: [{ field: 'id', message: 'Invalid ObjectId' }],
            });
            return;
        }

        const errors= await blogsRepository.deleteBlog(blogId);

        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({ errorsMessages: errors });
            return;
        }

        // Если всё успешно, отправляем 204
        res.status(204).send();
    }
}