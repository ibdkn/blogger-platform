import {Router} from "express";
import {commentsController} from "./comments.controller";
import {authJWTGuard} from "../common/middlewares/authJWT.guard";
import {commentContentValidate} from "../posts/posts.validation";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";

export const commentsRouter = Router();

commentsRouter.get('/:id', commentsController.getComment);
commentsRouter.put('/:id', authJWTGuard, commentContentValidate, handleValidationErrors, commentsController.updateComment);
commentsRouter.delete('/:id', authJWTGuard, commentsController.deleteComment);