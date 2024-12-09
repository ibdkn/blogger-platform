import {Router} from "express";
import {postsController} from "./posts.controller";
import {authBaseGuard} from "../common/middlewares/authBase.guard";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {validatePostFieldsWithBlogId} from "./posts.validation";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPost);
postsRouter.post('/', authBaseGuard, ...validatePostFieldsWithBlogId, handleValidationErrors, postsController.createPost);
postsRouter.put('/:id', authBaseGuard, ...validatePostFieldsWithBlogId, handleValidationErrors, postsController.updatePost);
postsRouter.delete('/:id', authBaseGuard, postsController.deletePost);