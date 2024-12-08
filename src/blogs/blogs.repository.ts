import {BlogType} from './blogs.types';
import {blogsCollection} from "../db/db";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";

export const blogsRepository = {
    async getBlog(id: string): Promise<WithId<BlogType> | null> {
        return await blogsCollection
            .findOne({_id: new ObjectId(id)});
    },
    async createBlog(newBlog: BlogType): Promise<InsertOneResult> {
        return await blogsCollection
            .insertOne(newBlog);
    },
    async updateBlog(id: string, fields: Omit<BlogType, 'createdAt' | 'isMembership'>): Promise<UpdateResult> {
       return await blogsCollection
            .updateOne(
                {_id: new ObjectId(id)},
                {
                    $set: fields
                })
    },
    async deleteBlog(id: string): Promise<DeleteResult> {
        return await blogsCollection
            .deleteOne({_id: new ObjectId(id)})
    }
}