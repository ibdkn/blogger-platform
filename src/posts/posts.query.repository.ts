import {ObjectId, WithId} from "mongodb";
import {blogsCollection, postsCollection} from "../db/db";
import {PaginationType} from "../common/types/pagination.types";
import {PostType, PostViewModelType} from "./posts.types";
import {BlogType} from "../blogs/blogs.types";

export const postsQueryRepository = {
    async getPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc'
    ): Promise<PaginationType<PostViewModelType>> {
        const posts: WithId<PostType>[] = await postsCollection
            .find({})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1} as any)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        if (!posts) {
            return {
                pagesCount: 0,
                page: 1,
                pageSize: 1,
                totalCount: 0,
                items: []
            }
        }

        const postsCount: number = await postsCollection.countDocuments({});
        const transformedPosts: PostViewModelType[] = posts.map(post => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }));

        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: transformedPosts
        }
    },
    async getPost(id: string): Promise<PostViewModelType> {
        const post: WithId<PostType> | null = await postsCollection
            .findOne({_id: new ObjectId(id)});

        if (!post) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Post not found'}]
            };
        }

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        };
    },
    async getPostsByBlogId(
        blogId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc'
    ): Promise<PaginationType<PostViewModelType>> {
        const blog: WithId<BlogType> | null = await blogsCollection
            .findOne({_id: new ObjectId(blogId)});

        if (!blog) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Blog with the given blogId does not exist'}]
            };
        }

        const posts: WithId<PostType>[] = await postsCollection
            .find({blogId})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1} as any)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        if (!posts) {
            return {
                pagesCount: 0,
                page: pageNumber,
                pageSize,
                totalCount: 0,
                items: []
            }
        }

        const postsCount: number = await postsCollection.countDocuments({blogId});

        const transformedPosts: PostViewModelType[] = posts.map(post => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }));

        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: transformedPosts
        }
    },
}