import {Router} from "express";
import {postsController} from "./posts.controller";
import {authMiddleware} from "../common/middlewares/auth.middleware";
import {handleValidationErrors} from "../common/middlewares/errors-result.middleware";
import {validatePostFields} from "../common/validation/posts-validators";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPost);
postsRouter.post('/', authMiddleware, ...validatePostFields, handleValidationErrors, postsController.createPost);
postsRouter.put('/:id', authMiddleware, ...validatePostFields, handleValidationErrors, postsController.updatePost);
postsRouter.delete('/:id', authMiddleware, postsController.deletePost);