import {Router} from "express";
import {blogsController} from "./blogs.controller";
import {authMiddleware} from "../common/middlewares/auth.middleware";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {validateBlogsFields} from "./blogs.validation";
export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);
blogsRouter.get('/:id', blogsController.getBlog);
blogsRouter.post('/', authMiddleware, ...validateBlogsFields, handleValidationErrors, blogsController.createBlog);
blogsRouter.put('/:id', authMiddleware, ...validateBlogsFields, handleValidationErrors, blogsController.updateBlog);
blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog);
