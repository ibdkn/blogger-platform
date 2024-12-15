import {Router} from "express";
import {postsController} from "./posts.controller";
import {commentsController} from "../comments/comments.controller";
import {baseAuthGuard} from "../auth/guards/base.auth.guard";
import {accessTokenGuard} from "../auth/guards/access.token.guard";
import {inputValidation} from "../common/validation/input.validation";
import {postFieldValidation, postFieldValidationWithBlogId} from "./midlewares/postFields.validation";
import {commentFieldsValidation} from "../comments/midlewares/contentValidation";

export const postsRouter: Router = Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPost);
postsRouter.get('/:postId/comments', commentsController.getComments);
postsRouter.post('/', baseAuthGuard, ...postFieldValidationWithBlogId, inputValidation, postsController.createPost);
postsRouter.post('/:postId/comments', accessTokenGuard, ...commentFieldsValidation, inputValidation, commentsController.createComment);
postsRouter.put('/:id', baseAuthGuard, ...postFieldValidationWithBlogId, inputValidation, postsController.updatePost);
postsRouter.delete('/:id', baseAuthGuard, postsController.deletePost);