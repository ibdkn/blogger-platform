import {Router} from "express";
import {postsController} from "./posts.controller";
import {authMiddleware} from "../common/middlewares/auth.middleware";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {validatePostFields} from "./posts.validation";
import {blogIdValidate} from "../common/middlewares/blogId.validation";
import {validateObjectId} from "../helpers/validation.helper";
import {blogsController} from "../blogs/blogs.controller";
import {blogsRouter} from "../blogs/blogs.router";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPost);
blogsRouter.get('/:blogId/posts', postsController.getPostsByBlogId);
postsRouter.post('/', authMiddleware, blogIdValidate, ...validatePostFields, handleValidationErrors, postsController.createPost);
blogsRouter.post('/:blogId/posts', authMiddleware, ...validatePostFields, handleValidationErrors, postsController.createPostForSpecificBlog);
postsRouter.put('/:id', authMiddleware, blogIdValidate, ...validatePostFields, handleValidationErrors, postsController.updatePost);
postsRouter.delete('/:id', authMiddleware, postsController.deletePost);