import {BlogType, BlogViewModelType} from './blogs.types';
import {blogsCollection, postsCollection} from "../db/db";
import {DeleteResult, InsertOneResult, ObjectId, UpdateOneModel, UpdateResult, WithId} from "mongodb";
import {PostType} from "../posts/posts.types";

export const blogsRepository = {
    async getBlogs(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        searchNameTerm: string | null
    ): Promise<WithId<BlogType>[]> {
        const filter: any = {};

        // Add a filter condition if searchNameTerm is provided
        if (searchNameTerm) {
            // Use regex to perform a case-insensitive partial match on the 'name' field
            filter.name = {$regex: searchNameTerm, $options: 'i'}
        }

        // Query the blogs collection with the filter
        return await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 } as any)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    async getBlogsCount(searchNameTerm: string | null): Promise<number> {
        const filter: any = {};

        // Add a filter condition if searchNameTerm is provided
        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'}
        }

        // Return the total count of documents in the blogs collection that match the specified filter
        return await blogsCollection.countDocuments(filter);
    },
    async getBlog(id: string): Promise<BlogViewModelType | null> {
        const blog = await blogsCollection
            .findOne({_id: new ObjectId(id)});

        if (blog) {
            // Transform the blog into the required format
            return {
                id: blog._id.toString(), // Convert ObjectId to string
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership,
            };
        } else {
            return null;
        }
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