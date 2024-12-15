import {BlogType} from './blogs.types';
import {blogsCollection} from "../db/db";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";

export const blogsRepository = {
    async findById(id: string): Promise<WithId<BlogType> | null> {
        return await blogsCollection.findOne({_id: new ObjectId(id)});
    },
    async create(newBlog: BlogType): Promise<string> {
        const result: InsertOneResult<BlogType> = await blogsCollection.insertOne(newBlog);
        return result.insertedId.toString();
    },
    async update(id: string, fields: Omit<BlogType, 'createdAt' | 'isMembership'>): Promise<UpdateResult> {
       return await blogsCollection.updateOne({_id: new ObjectId(id)}, {$set: fields});
    },
    async delete(id: string): Promise<DeleteResult> {
        return await blogsCollection.deleteOne({_id: new ObjectId(id)})
    }
}