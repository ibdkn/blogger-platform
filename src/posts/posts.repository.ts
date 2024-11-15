import {PostType} from "./posts.types";
import {db} from "../db/db";

export const postsRepository = {
    getAllPosts(): PostType[] {
        return db.posts;
    }
}