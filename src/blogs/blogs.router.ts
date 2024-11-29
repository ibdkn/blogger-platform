import {Router} from "express";
import {blogsController} from "./blogs.controller";
import {authMiddleware} from "../common/middlewares/auth.middleware";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {validateBlogsFields} from "./blogs.validation";
import {validatePostFields} from "../posts/posts.validation";

export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);
blogsRouter.get('/:id', blogsController.getBlog);
blogsRouter.get('/:blogId/posts?pageNumber=1&pageSize=10&sortBy=createdAt&sortDirection=desc', blogsController.getPostsByBlogId);
blogsRouter.post('/', authMiddleware, ...validateBlogsFields, handleValidationErrors, blogsController.createBlog);
blogsRouter.post('/:blogId/posts', authMiddleware, ...validatePostFields, handleValidationErrors, blogsController.createPost);
blogsRouter.put('/:id', authMiddleware, ...validateBlogsFields, handleValidationErrors, blogsController.updateBlog);
blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog);
