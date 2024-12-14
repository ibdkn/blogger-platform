import {Router} from "express";
import {blogsController} from "./blogs.controller";
import {baseAuthGuard} from "../auth/guards/base.auth.guard";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {validateBlogsFields} from "./blogs.validation";
import {postsController} from "../posts/posts.controller";
import {validatePostFields} from "../posts/posts.validation";
export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);
blogsRouter.get('/:id', blogsController.getBlog);
blogsRouter.get('/:blogId/posts', postsController.getPostsByBlogId);
blogsRouter.post('/', baseAuthGuard, ...validateBlogsFields, handleValidationErrors, blogsController.createBlog);
blogsRouter.post('/:blogId/posts', baseAuthGuard, ...validatePostFields, handleValidationErrors, postsController.createPostForSpecificBlog);
blogsRouter.put('/:id', baseAuthGuard, ...validateBlogsFields, handleValidationErrors, blogsController.updateBlog);
blogsRouter.delete('/:id', baseAuthGuard, blogsController.deleteBlog);
