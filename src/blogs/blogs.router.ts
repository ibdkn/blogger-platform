import {Router} from "express";
import {blogsController} from "./blogs.controller";
import {authMiddleware} from "../common/middlewares/auth.middleware";
import {validateBlogFields} from "../common/middlewares/validators";

export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);
blogsRouter.get('/:id', blogsController.getBlog);
blogsRouter.post('/', authMiddleware, validateBlogFields, blogsController.createBlog);
blogsRouter.put('/:id', authMiddleware, validateBlogFields, blogsController.updateBlog);
blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog);
