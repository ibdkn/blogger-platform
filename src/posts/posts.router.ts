import {Router} from "express";
import {postsController} from "./posts.controller";
import {baseAuthGuard} from "../auth/guards/base.auth.guard";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {commentContentValidate, validatePostFieldsWithBlogId} from "./posts.validation";
import {accessTokenGuard} from "../auth/guards/access.token.guard";
import {commentsController} from "../comments/comments.controller";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPost);
postsRouter.get('/:postId/comments', commentsController.getComments);
postsRouter.post('/', baseAuthGuard, ...validatePostFieldsWithBlogId, handleValidationErrors, postsController.createPost);
postsRouter.post('/:postId/comments', accessTokenGuard, commentContentValidate, handleValidationErrors, commentsController.createComment);
postsRouter.put('/:id', baseAuthGuard, ...validatePostFieldsWithBlogId, handleValidationErrors, postsController.updatePost);
postsRouter.delete('/:id', baseAuthGuard, postsController.deletePost);