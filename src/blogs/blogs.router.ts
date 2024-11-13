import {Router} from "express";
import {blogsController} from "./blogs.controller";
import {authMiddleware} from "../common/middlewares/auth.middleware";
import {validateCreateBlog} from "../common/middlewares/validators";

export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);
blogsRouter.get('/:id', blogsController.getBlog);
blogsRouter.post('/', authMiddleware, validateCreateBlog, blogsController.createBlog);
