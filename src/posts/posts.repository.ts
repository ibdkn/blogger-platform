import {PostType} from "./posts.types";
import {postsCollection} from "../db/db";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";

export const postsRepository = {
    async getPost(id: string): Promise<WithId<PostType> | null> {
        return await postsCollection
            .findOne({_id: new ObjectId(id)});
    },
    async createPost(newPost: PostType): Promise<InsertOneResult> {
        return await postsCollection
            .insertOne(newPost);
    },
    async createPostForSpecificBlog(post: PostType): Promise<InsertOneResult> {
        return await postsCollection
            .insertOne(post);
    },
    async updatePost(id: string, fields: Omit<PostType, 'blogName' | 'createdAt'>): Promise<UpdateResult>  {
        return await postsCollection
            .updateOne(
                {_id: new ObjectId(id)},
                {
                    $set: fields
                });
    },
    async deletePost(id: string): Promise<DeleteResult> {
        return await postsCollection
            .deleteOne({_id: new ObjectId(id)});
    }
}