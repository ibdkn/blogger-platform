import {Router} from "express";
import {postsController} from "./posts.controller";
import {authBaseGuard} from "../common/middlewares/authBase.guard";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {commentContentValidate, validatePostFieldsWithBlogId} from "./posts.validation";
import {authJWTGuard} from "../common/middlewares/authJWT.guard";
import {commentsController} from "../comments/comments.controller";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPost);
postsRouter.get('/:postId/comments', commentsController.getComments);
postsRouter.post('/', authBaseGuard, ...validatePostFieldsWithBlogId, handleValidationErrors, postsController.createPost);
postsRouter.post('/:postId/comments', authJWTGuard, commentContentValidate, handleValidationErrors, commentsController.createComment);
postsRouter.put('/:id', authBaseGuard, ...validatePostFieldsWithBlogId, handleValidationErrors, postsController.updatePost);
postsRouter.delete('/:id', authBaseGuard, postsController.deletePost);