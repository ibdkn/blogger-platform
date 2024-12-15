import {postsRepository} from "./posts.repository";
import {PostType, PostViewModelType} from "./posts.types";
import {blogsRepository} from "../blogs/blogs.repository";
import {DeleteResult, InsertOneResult, UpdateResult, WithId} from "mongodb";
import {BlogType} from "../blogs/blogs.types";
import {DomainError} from "../common/types/error.types";

export const postsService = {
    async createPostForSpecificBlog(
        blogId: string,
        body: Omit<PostType, 'blogId' | 'blogName' | 'isMembership'>
    ): Promise<PostViewModelType> {
        const blog: WithId<BlogType> | null = await blogsRepository.getBlog(blogId);

        if (!blog) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Blog with the given blogId does not exist'}]
            };
        }

        const post = {
            ...body,
            blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };

        const result: InsertOneResult = await postsRepository.createPostForSpecificBlog(post);

        if (result.acknowledged) {
            return {
                id: result.insertedId.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            };
        } else {
            throw {
                status: 500,
                errorsMessages: [{message: 'Failed to create the post'}]
            };
        }
    },
    async createPost(body: Omit<PostType, 'blogName' | 'isMembership'>): Promise<PostViewModelType> {
        const blog: WithId<BlogType> | null = await blogsRepository.getBlog(body.blogId);

        if (!blog) {
            throw new DomainError(
                404,
                 [{message: 'Blog not found'}]
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

        const result: InsertOneResult = await postsRepository.createPost(newPost);

        if (result.acknowledged) {
            return {
                id: result.insertedId.toString(),
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt,
            };
        } else {
            throw {
                status: 500,
                errorsMessages: [{message: 'Failed to create the post'}]
            };
        }
    },
    async updatePost(id: string, body: PostType): Promise<void> {
        const post: WithId<PostType> | null = await postsRepository.getById(id);

        if (!post) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Post not found'}]
            };
        }

        const blog: WithId<BlogType> | null = await blogsRepository.getBlog(body.blogId);

        if (!blog) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Blog not found'}]
            };
        }

        const updatedFields = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId
        }

        const result: UpdateResult = await postsRepository.updatePost(id, updatedFields);

        if (result.matchedCount === 0) {
            throw {
                status: 500,
                errorsMessages: [{message: 'Failed to update the post'}]
            };
        }
    },
    async deletePost(id: string): Promise<void> {
        const post: WithId<PostType> | null = await postsRepository.getById(id);

        if (!post) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Post not found'}]
            };
        }

        const result: DeleteResult = await postsRepository.deletePost(id);

        if (result.deletedCount === 0) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Post was not deleted'}]
            };
        }
    }
}