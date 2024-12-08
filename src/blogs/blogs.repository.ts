import {BlogEntityModelType, BlogType, BlogViewModelType} from './blogs.types';
import {blogsCollection} from "../db/db";
import {DeleteResult, EnhancedOmit, InferIdType, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";

export const blogsRepository = {
    async getBlog(id: string): Promise<BlogEntityModelType | null> {
        const blog = await blogsCollection
            .findOne({_id: new ObjectId(id)});

        if (!blog) return null;

        return {
            _id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        };
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