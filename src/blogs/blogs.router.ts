import {Router} from "express";
import {blogsController} from "./blogs.controller";
import {authBaseGuard} from "../common/middlewares/authBase.guard";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {validateBlogsFields} from "./blogs.validation";
import {postsController} from "../posts/posts.controller";
import {validatePostFields} from "../posts/posts.validation";
export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);
blogsRouter.get('/:id', blogsController.getBlog);
blogsRouter.get('/:blogId/posts', postsController.getPostsByBlogId);
blogsRouter.post('/', authBaseGuard, ...validateBlogsFields, handleValidationErrors, blogsController.createBlog);
blogsRouter.post('/:blogId/posts', authBaseGuard, ...validatePostFields, handleValidationErrors, postsController.createPostForSpecificBlog);
blogsRouter.put('/:id', authBaseGuard, ...validateBlogsFields, handleValidationErrors, blogsController.updateBlog);
blogsRouter.delete('/:id', authBaseGuard, blogsController.deleteBlog);
