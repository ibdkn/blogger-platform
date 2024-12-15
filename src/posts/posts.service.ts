import {postsRepository} from "./posts.repository";
import {PostType, PostViewType} from "./posts.types";
import {blogsRepository} from "../blogs/blogs.repository";
import {DeleteResult, InsertOneResult, UpdateResult, WithId} from "mongodb";
import {BlogType} from "../blogs/blogs.types";
import {AppError, DomainError} from "../common/types/error.types";
import {ResultStatus} from "../common/result/resultCode";

export const postsService = {
    async createForSpecificBlog(
        blogId: string,
        body: Omit<PostType, 'blogId' | 'blogName' | 'isMembership'>
    ): Promise<string> {
        const blog: WithId<BlogType> | null = await blogsRepository.findById(blogId);

        if (!blog) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Blog not found'}],
                null
            );
        }

        const post = {
            ...body,
            blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };

        return await postsRepository.createForSpecificBlog(post);
    },
    async create(body: Omit<PostType, 'blogName' | 'isMembership'>): Promise<string> {
        const blog: WithId<BlogType> | null = await blogsRepository.findById(body.blogId);

        if (!blog) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Blog not found'}],
                null
            );
        }

        const newPost = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        }

        return await postsRepository.create(newPost);
    },
    async updatePost(id: string, body: PostType): Promise<void> {
        const post: WithId<PostType> | null = await postsRepository.getById(id);

        if (!post) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Post not found'}],
                null
            );
        }

        const blog: WithId<BlogType> | null = await blogsRepository.findById(body.blogId);

        if (!blog) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Blog not found'}],
                null
            );
        }

        const updatedFields = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId
        }

        const result: UpdateResult = await postsRepository.update(id, updatedFields);

        if (result.matchedCount === 0) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Failed to update the post'}],
                null
            );
        }
    },
    async delete(id: string): Promise<void> {
        const post: WithId<PostType> | null = await postsRepository.getById(id);

        if (!post) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Post not found'}],
                null
            );
        }

        const result: DeleteResult = await postsRepository.delete(id);

        if (result.deletedCount === 0) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Post was not deleted'}],
                null
            );
        }
    }
}