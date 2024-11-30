import {Request, Response} from "express";
import {blogsService} from "./blogs.service";
import {paginationQueries} from "../helpers/pagination.helper";
import {PaginatedResult} from "../common/types/pagination.types";
import {BlogType, BlogViewModelType} from "./blogs.types";
import {postsService} from "../posts/posts.service";
import {PostViewModelType} from "../posts/posts.types";

export const blogsController = {
    async getBlogs(req: Request, res: Response): Promise<void> {
        try {
            // Extract parameters
            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                searchNameTerm,
            } = paginationQueries(req);

            const blogs: PaginatedResult<BlogViewModelType>  = await blogsService.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm)

            res.status(200).json(blogs);
        } catch (e: any) {
            console.error('Error occurred while fetching blogs:', e);

            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getBlog(req: Request, res: Response): Promise<void> {
        try {
            const blog: BlogViewModelType = await blogsService.getBlog(req.params.id);

            res.status(200).json(blog);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async getPostsByBlogId(req: Request, res: Response): Promise<void> {
        try {
            const {
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            } = paginationQueries(req);

            console.log(req.params.id)

            const posts: PaginatedResult<PostViewModelType> = await postsService.getPostsByBlogId(req.params.blogId, pageNumber, pageSize, sortBy, sortDirection);

            res.status(200).json(posts);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async createPostForSpecificBlog(req: Request, res: Response){
        try {
            const newPost = await postsService.createPostForSpecificBlog(req.params.blogId, req.body);
            // Return success response with status code 201
            res.status(201).json(newPost);
        } catch (e: any) {
            if (e.status) {
                // Return error response along with the provided error messages
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                // Return server error response with status code 500
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async createBlog(req: Request, res: Response): Promise<void> {
        try {
            const newBlog: BlogType = await blogsService.createBlog(req.body);

            res.status(201).json(newBlog);
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async updateBlog(req: Request, res: Response): Promise<void> {
        try {
            await blogsService.updateBlog(req.params.id, req.body);
            res.status(204).send();
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    },
    async deleteBlog(req: Request, res: Response): Promise<void> {
        try {
            await blogsService.deleteBlog(req.params.id);
            res.status(204).send();
        } catch (e: any) {
            if (e.status) {
                res.status(e.status).json({ errorsMessages: e.errorsMessages });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}