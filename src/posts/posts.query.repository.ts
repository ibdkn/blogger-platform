import {ObjectId, WithId} from "mongodb";
import {blogsCollection, postsCollection} from "../db/db";
import {PaginationType} from "../common/types/pagination.types";
import {PostType, PostViewType} from "./posts.types";
import {BlogType} from "../blogs/blogs.types";
import {AppError} from "../common/types/error.types";
import {ResultStatus} from "../common/result/resultCode";

export const postsQueryRepository = {
    async getPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc'
    ): Promise<PaginationType<PostViewType>> {
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
        const transformedPosts: PostViewType[] = posts.map(post => ({
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
    async findById(id: string): Promise<PostViewType> {
        const post: WithId<PostType> | null = await postsCollection.findOne({_id: new ObjectId(id)});

        if (!post) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Post not found'}],
                null
            );
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
    async findAllByBlogId(
        blogId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc'
    ): Promise<PaginationType<PostViewType>> {
        const blog: WithId<BlogType> | null = await blogsCollection.findOne({_id: new ObjectId(blogId)});

        if (!blog) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Blog not found'}],
                null
            );
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

        const transformedPosts: PostViewType[] = posts.map(post => ({
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