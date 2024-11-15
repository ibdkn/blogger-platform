import {Router} from "express";
import {postsController} from "./posts.controller";
import {validatePostFields} from "../common/middlewares/validators";
import {authMiddleware} from "../common/middlewares/auth.middleware";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPost);
postsRouter.post('/', authMiddleware, validatePostFields, postsController.createPost);
postsRouter.put('/:id', authMiddleware, validatePostFields, postsController.updatePost);
postsRouter.delete('/:id', authMiddleware, postsController.deletePost);