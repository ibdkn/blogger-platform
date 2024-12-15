import {Router} from "express";
import {blogsController} from "./blogs.controller";
import {baseAuthGuard} from "../auth/guards/base.auth.guard";
import {postsController} from "../posts/posts.controller";
import {postFieldValidation} from "../posts/midlewares/postFields.validation";
import {inputValidation} from "../common/validation/input.validation";
import {blogFieldsValidation} from "./midlewares/blogFields.validation";
export const blogsRouter: Router = Router();

blogsRouter.get('/', blogsController.getBlogs);
blogsRouter.get('/:id', blogsController.getBlog);
blogsRouter.get('/:blogId/posts', postsController.getPostsByBlogId);
blogsRouter.post('/', baseAuthGuard, ...blogFieldsValidation, inputValidation, blogsController.createBlog);
blogsRouter.post('/:blogId/posts', baseAuthGuard, ...postFieldValidation, inputValidation, postsController.createPostForSpecificBlog);
blogsRouter.put('/:id', baseAuthGuard, ...blogFieldsValidation, inputValidation, blogsController.updateBlog);
blogsRouter.delete('/:id', baseAuthGuard, blogsController.deleteBlog);
