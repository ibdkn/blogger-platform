import {Router} from "express";
import {postsController} from "./posts.controller";

export const postsRouter = new Router();

postsRouter.get('/', postsController.getPosts);