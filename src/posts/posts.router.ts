import {Router} from "express";
import {postsController} from "./posts.controller";
import {authMiddleware} from "../common/middlewares/auth.middleware";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {validatePostFields} from "./posts.validation";
import {blogsRouter} from "../blogs/blogs.router";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPost);
postsRouter.get('/:blogId/posts', postsController.getPostsByBlogId);
postsRouter.post('/', authMiddleware, ...validatePostFields, handleValidationErrors, postsController.createPost);
postsRouter.post('/:blogId/posts', authMiddleware, ...validatePostFields, handleValidationErrors, postsController.createPostForSpecificBlog);
postsRouter.put('/:id', authMiddleware, ...validatePostFields, handleValidationErrors, postsController.updatePost);
postsRouter.delete('/:id', authMiddleware, postsController.deletePost);