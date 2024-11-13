import {Request, Response} from "express";
import {blogsRepository} from "./blogs.repository";
import {BlogType} from "./blogs.types";
import {blogDB} from "../db/blogs.db";

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
        const {name, description, websiteUrl} = req.body;

        const newBlog: BlogType = {
            id: `${Date.now()}-${Math.random()}`,
            name,
            description,
            websiteUrl
        };

        blogDB.push(newBlog);
        res.status(201).json(newBlog);
    }
}