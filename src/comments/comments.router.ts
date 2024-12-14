import {Router} from "express";
import {commentsController} from "./comments.controller";
import {accessTokenGuard} from "../auth/guards/access.token.guard";
import {commentContentValidate} from "../posts/posts.validation";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";

export const commentsRouter = Router();

commentsRouter.get('/:id', commentsController.getComment);
commentsRouter.put('/:id', accessTokenGuard, commentContentValidate, handleValidationErrors, commentsController.updateComment);
commentsRouter.delete('/:id', accessTokenGuard, commentsController.deleteComment);