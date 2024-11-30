import {postsRepository} from "./posts.repository";
import {PostType, PostViewModelType} from "./posts.types";
import {blogsService} from "../blogs/blogs.service";
import {blogsRepository} from "../blogs/blogs.repository";
import {BlogType, BlogViewModelType} from "../blogs/blogs.types";
import {PaginatedResult} from "../common/types/pagination.types";
import {ObjectId, WithId} from "mongodb";

export const postsService = {
    async getPosts(pageNumber: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        const posts = await postsRepository.getPosts(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        );
        const postsCount = await postsRepository.getPostsCount();

        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: posts
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
                errorsMessages: [{ message: 'Blog with the given blogId does not exist' }]
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
    async getPost(id: string) {
        return await postsRepository.getPost(id);
    },
    async createPostForSpecificBlog(
        blogId: string,
        body: Omit<PostType, 'blogId' | 'blogName' | 'isMembership'>
    ) {
        // Fetch a single blog by its ID from the repository
        const blog: BlogViewModelType | null = await blogsRepository.getBlog(blogId);

        // Throw an error if the blog is not found
        if (!blog) {
            throw {
                status: 404,
                errorsMessages: [{ message: 'Blog with the given blogId does not exist' }]
            };
        }

        // Формируем данные для поста
        const post = {
            ...body,
            blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };

        // Сохраняем пост
        const result = await postsRepository.createPostForSpecificBlog(post);

        // Проверяем, что вставка прошла успешно, и формируем объект результата
        if (result.acknowledged) {
            return {
                id: result.insertedId.toString(), // Преобразуем _id в строку
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
                errorsMessages: [{ message: 'Failed to create the post' }]
            };
        }
    },
    async createPost(body: Omit<PostType, 'blogName' | 'isMembership'>) {
        return await postsRepository.createPost(body);
    },
    async updatePost(id: string, body: PostType) {
        return postsRepository.updatePost(id, body);
    },
    async deletePost(id: string) {
        return await postsRepository.deletePost(id);
    }
}