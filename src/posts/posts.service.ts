import {postsRepository} from "./posts.repository";
import {PostType} from "./posts.types";
import {blogsRepository} from "../blogs/blogs.repository";

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
            pageCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: posts
        }
    },
    async getPost(id: string) {
        return await postsRepository.getPost(id);
    },
    async createPost(body: Omit<PostType, 'blogName' | 'isMembership'>) {
        // Проверяем существование блога
        const blog = await blogsRepository.getBlog(body.blogId);
        if (!blog) {
            throw new Error('Blog not found');
        }

        // Формируем данные для поста
        const post = {
            ...body,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };
        return await postsRepository.createPost(post);
    },
    async updatePost(id: string, body: PostType) {
        return postsRepository.updatePost(id, body);
    },
    async deletePost(id: string) {
        return await postsRepository.deletePost(id);
    }
}