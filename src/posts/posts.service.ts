import {postsRepository} from "./posts.repository";
import {PostType, PostViewModelType} from "./posts.types";
import {blogsService} from "../blogs/blogs.service";
import {blogsRepository} from "../blogs/blogs.repository";
import {BlogType, BlogViewModelType} from "../blogs/blogs.types";
import {PaginatedResult} from "../common/types/pagination.types";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId} from "mongodb";

export const postsService = {
    async getPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc'
    ): Promise<PaginatedResult<PostViewModelType>> {
        // Fetch paginated and sorted posts from the repository
        const posts: WithId<PostType>[] = await postsRepository.getPosts(pageNumber, pageSize, sortBy, sortDirection);
        // Get the total count of posts matching the filter
        const postsCount: number = await postsRepository.getPostsCount();

        if (!posts) {
            return {
                pagesCount: 0,
                page: 1,
                pageSize: 1,
                totalCount: 0,
                items: []
            }
        }

        const transformedPosts = posts.map(post => ({
            id: post._id.toString(), // Convert ObjectId to string
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }));

        // Return paginated result including page info and post items
        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: transformedPosts
        }
    },
    async getPostsByBlogId(
        blogId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc'
    ): Promise<PaginatedResult<PostViewModelType>> {
        // Fetch a single blog by its ID from the repository
        const blog: BlogViewModelType | null = await blogsRepository.getBlog(blogId);

        // Throw an error if the blog is not found
        if (!blog) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Blog with the given blogId does not exist'}]
            };
        }

        // Fetch paginated and sorted blogs from the repository
        const posts: WithId<PostType>[] = await postsRepository.getPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection);
        // Get the total count of posts matching the filter
        const postsCount: number = await postsRepository.getPostsByIdCount(blogId);

        if (!posts) {
            return {
                pagesCount: 0,
                page: pageNumber,
                pageSize,
                totalCount: 0,
                items: []
            }
        }

        const transformedPosts: PostViewModelType[] = posts.map(post => ({
            id: post._id.toString(), // Convert ObjectId to string
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: blog.id,
            blogName: blog.name,
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
        const post: WithId<PostType> | null = await postsRepository.getPost(id);

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
    async createPostForSpecificBlog(
        blogId: string,
        body: Omit<PostType, 'blogId' | 'blogName' | 'isMembership'>
    ): Promise<PostViewModelType> {
        // Fetch a single blog by its ID from the repository
        const blog: BlogViewModelType | null = await blogsRepository.getBlog(blogId);

        // Throw an error if the blog is not found
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
                id: result.insertedId.toString(), // Convert ObjectId to string
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
        // Fetch a single blog by its ID from the repository
        const blog: BlogViewModelType | null = await blogsRepository.getBlog(body.blogId);

        // Throw an error if the blog is not found
        if (!blog) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Blog not found'}]
            };
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

        // Return the result in the desired format
        if (result.acknowledged) {
            return {
                id: result.insertedId.toString(), // Convert ObjectId to string
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
        // Fetch a single post by its ID from the repository
        const post: PostViewModelType = await this.getPost(id);

        // Throw an error if the post is not found
        if (!post) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Post not found'}]
            };
        }

        // Fetch a single blog by its ID from the repository
        const blog: BlogViewModelType | null = await blogsRepository.getBlog(body.blogId);

        // Throw an error if the blog is not found
        if (!blog) {
            throw {
                status: 404,
                errorsMessages: [{message: 'Blog not found'}]
            };
        }

        // Prepare the fields to update in the post
        const updatedFields = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId
        }

        const result: UpdateResult = await postsRepository.updatePost(id, updatedFields);

        // Throw an error if no documents were matched
        if (result.matchedCount === 0) {
            throw {
                status: 500,
                errorsMessages: [{message: 'Failed to update the post'}]
            };
        }
    },
    async deletePost(id: string): Promise<void> {
        // Fetch a single post by its ID from the repository
        const post: PostViewModelType = await this.getPost(id);

        // Throw an error if the post is not found
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