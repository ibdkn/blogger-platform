import {Router} from "express";
import {blogsController} from "./blogs.controller";
import {authMiddleware} from "../common/middlewares/auth.middleware";
import {validateCreateBlog, validateUpdateBlog} from "../common/middlewares/validators";

export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);
blogsRouter.get('/:id', blogsController.getBlog);
blogsRouter.post('/', authMiddleware, validateCreateBlog, blogsController.createBlog);
blogsRouter.put('/:id', authMiddleware, validateUpdateBlog, blogsController.updateBlog);
blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog);
