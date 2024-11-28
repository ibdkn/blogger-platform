import {Request, Response} from "express";
import {blogsRepository} from "./blogs.repository";
import {blogsService} from "./blogs.service";
import {paginationPostQueries, paginationQueries} from "../helpers/pagination.helper";
import {ObjectId} from "mongodb";

export const blogsController = {
    async getBlogs(req: Request, res: Response): Promise<void> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm
        } = paginationQueries(req);

        const blogs = await blogsService.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)

        res.status(200).json(blogs);
    },
    async getBlog(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const blog = await blogsService.getBlog(id);

        if (!blog) {
            res.status(404).json({
                errorsMessages: [{field: 'id', message: 'Blog not found'}]
            });
            return;
        }

        res.status(200).json(blog);
    },
    async getPostsByBlogId(req: Request, res: Response): Promise<void> {
        const { blogId } = req.params;

        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = paginationPostQueries(req);

        const posts = await blogsService.getPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection);

        res.status(200).json(posts);
    },
    async createPost(req: Request, res: Response){
        const { blogId } = req.params;

        if (!ObjectId.isValid(blogId)) {
            res.status(400).json({
                errorsMessages: [{ field: 'id', message: 'Invalid ObjectId' }],
            });
            return;
        }

        const { title, shortDescription, content } = req.body;

        const blog = await blogsRepository.getBlog(blogId);
        if (!blog) {
            res.status(404).json({
                errorsMessages: [{field: 'id', message: 'Blog not found'}]
            });
            return;
        }

        const newPost = await blogsService.createPost(title, shortDescription, content, blogId, blog.name);

        res.status(201).json(newPost);
    },
    async createBlog(req: Request, res: Response): Promise<void> {
        const newBlog = await blogsService.createBlog(req.body);
        res.status(201).json(newBlog);
    },
    async updateBlog(req: Request, res: Response): Promise<void> {
        const { id} = req.params;

        const errors = await blogsService.updateBlog(id, req.body);

        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({errorsMessages: errors});
            return;
        }

        // Если всё успешно, отправляем 204
        res.status(204).send();
    },
    async deleteBlog(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const errors = await blogsService.deleteBlog(id);

        // Если репозиторий вернул ошибки, отправляем 404 с описанием
        if (errors) {
            res.status(404).json({errorsMessages: errors});
            return;
        }

        // Если всё успешно, отправляем 204
        res.status(204).send();
    }
}