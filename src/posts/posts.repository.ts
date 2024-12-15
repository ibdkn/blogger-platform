import {PostType} from "./posts.types";
import {postsCollection} from "../db/db";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";

export const postsRepository = {
    async getById(id: string): Promise<WithId<PostType> | null> {
        return await postsCollection.findOne({_id: new ObjectId(id)});
    },
    async create(newPost: PostType): Promise<string> {
        const result: InsertOneResult<PostType> = await postsCollection.insertOne(newPost);
        return result.insertedId.toString();
    },
    async createForSpecificBlog(post: PostType): Promise<string> {
        const result: InsertOneResult<PostType> = await postsCollection.insertOne(post);
        return result.insertedId.toString();
    },
    async update(id: string, fields: Omit<PostType, 'blogName' | 'createdAt'>): Promise<UpdateResult>  {
        return await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: fields});
    },
    async delete(id: string): Promise<DeleteResult> {
        return await postsCollection.deleteOne({_id: new ObjectId(id)});
    }
}