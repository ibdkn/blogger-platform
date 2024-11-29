import {blogsRepository} from "./blogs.repository";
import {BlogType} from "./blogs.types";
import {PostType} from "../posts/posts.types";
import {ObjectId} from "mongodb";
import {postsCollection} from "../db/db";


export const blogsService = {
    async getBlogs(pageNumber: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc', searchNameTerm: string | null) {
        const blogs = await blogsRepository.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm);
        const blogsCount = await blogsRepository.getBlogsCount(searchNameTerm);

        return {
            pageCount: Math.ceil(blogsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: blogsCount,
            items: blogs
        }
    },
    async getBlog(blogId: string) {
        return await blogsRepository.getBlog(blogId);
    },
    async getPostsByBlogId(blogId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        const posts = await postsCollection
            .find({ blogId })
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const totalCount = await postsCollection.countDocuments({ blogId });

        return {
            pageCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(post => ({
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            })),
        };
    },
    async createPost(blogId: string, body: Omit<PostType, 'blogId' | 'blogName' | 'isMembership'>) {
        if (!ObjectId.isValid(blogId)) {
            throw {
                status: 400,
                errorsMessages: [{ field: 'blogId', message: 'Invalid ObjectId' }]
            };
        }

        // Проверяем существование блога
        const blog = await blogsRepository.getBlog(blogId);

        // Если пост не найден, возвращаем массив ошибок
        if (!blog) {
            throw {
                status: 404,
                errorsMessages: [{ field: 'blogId', message: 'Blog not found' }]
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
        return await blogsRepository.createPostForSpecificBlog(post);
    },
    async createBlog(body: Omit<BlogType, 'createdAt' | 'isMembership'>) {
        return await blogsRepository.createBlog(body);
    },
    async updateBlog(id: string, body: BlogType) {
        return await blogsRepository.updateBlog(id, body);
    },
    async deleteBlog(id: string) {
        return await blogsRepository.deleteBlog(id);
    }
};