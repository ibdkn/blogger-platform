import {Router} from "express";
import {postsController} from "./posts.controller";
import {authMiddleware} from "../common/middlewares/auth.middleware";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {validatePostFields} from "./posts.validation";
import {blogIdValidate} from "./blogId.validation";
import {validateObjectId} from "../common/middlewares/objectId.validation";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', validateObjectId, postsController.getPost);
postsRouter.post('/', authMiddleware, blogIdValidate, ...validatePostFields, handleValidationErrors, postsController.createPost);
postsRouter.put('/:id', authMiddleware, validateObjectId, blogIdValidate, ...validatePostFields, handleValidationErrors, postsController.updatePost);
postsRouter.delete('/:id', authMiddleware, validateObjectId, postsController.deletePost);