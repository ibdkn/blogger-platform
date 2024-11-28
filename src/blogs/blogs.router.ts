import {Router} from "express";
import {blogsController} from "./blogs.controller";
import {authMiddleware} from "../common/middlewares/auth.middleware";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {validateBlogsFields} from "./blogs.validation";
import {validatePostFields} from "../posts/posts.validation";
import {validateObjectId} from "../common/middlewares/objectId.validation";
import {blogIdValidate} from "../posts/blogId.validation";

export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);
blogsRouter.get('/:id', validateObjectId, blogsController.getBlog);
blogsRouter.get('/:blogId/posts', authMiddleware, blogIdValidate, handleValidationErrors, blogsController.getPostsByBlogId);
blogsRouter.post('/', authMiddleware, ...validateBlogsFields, handleValidationErrors, blogsController.createBlog);
blogsRouter.post('/:blogId/posts', authMiddleware, blogIdValidate, ...validatePostFields, handleValidationErrors, blogsController.createPost);
blogsRouter.put('/:id', authMiddleware, validateObjectId, ...validateBlogsFields, handleValidationErrors, blogsController.updateBlog);
blogsRouter.delete('/:id', authMiddleware, validateObjectId, blogsController.deleteBlog);
