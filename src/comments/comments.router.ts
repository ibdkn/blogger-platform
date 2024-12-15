import {Router} from "express";
import {commentsController} from "./comments.controller";
import {accessTokenGuard} from "../auth/guards/access.token.guard";
import {routersPaths} from "../common/path/paths";
import {commentFieldsValidation} from "./midlewares/contentValidation";
import {inputValidation} from "../common/validation/input.validation";

export const commentsRouter: Router = Router();

commentsRouter.get(routersPaths.id, commentsController.getComment);
commentsRouter.put(routersPaths.id, accessTokenGuard, ...commentFieldsValidation, inputValidation, commentsController.updateComment);
commentsRouter.delete(routersPaths.id, accessTokenGuard, commentsController.deleteComment);