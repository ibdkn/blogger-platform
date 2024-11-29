import {blogsRepository} from "./blogs.repository";
import {postsRepository} from "../posts/posts.repository";
import {BlogType} from "./blogs.types";
import {PostType} from "../posts/posts.types";


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
    async getPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection) {
        const posts = await postsRepository.getPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection);
        const postsCount = await postsRepository.getPostsByIdCount(blogId);

        return {
            pageCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: posts
        }
    },
    async createPost(blogId: string, body: Omit<PostType, 'blogId' | 'blogName' | 'isMembership'>) {
        // Проверяем существование блога
        const blog = await blogsRepository.getBlog(blogId);
        if (!blog) {
            throw new Error('Blog not found');
        }

        // Формируем данные для поста
        const post = {
            ...body,
            blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };

        // Сохраняем пост
        return postsRepository.createPost(post);
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