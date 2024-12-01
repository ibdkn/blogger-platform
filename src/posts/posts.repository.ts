import {PostType} from "./posts.types";
import {postsCollection} from "../db/db";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";

export const postsRepository = {
    async getPosts(pageNumber: number, pageSize: number, sortBy: any, sortDirection: 'asc' | 'desc'): Promise<WithId<PostType>[]> {
        return await postsCollection
            .find({})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1} as any)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    async getPostsCount(): Promise<number> {
        return await postsCollection.countDocuments({});
    },
    async getPostsByBlogId(blogId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc'): Promise<WithId<PostType>[]> {
        return await postsCollection
            .find({blogId})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1} as any)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    async getPostsByIdCount(blogId: string): Promise<number> {
        return await postsCollection.countDocuments({blogId});
    },
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
                })
    },
    async deletePost(id: string): Promise<DeleteResult> {
        return await postsCollection
            .deleteOne({_id: new ObjectId(id)})
    }
}