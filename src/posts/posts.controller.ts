import {Request, Response} from "express";
import {postsRepository} from "./posts.repository";

export const postsController = {
    getPosts(req: Request, res: Response): void {
        const posts = postsRepository.getAllPosts();
        res.status(200).json(posts);
    },
}