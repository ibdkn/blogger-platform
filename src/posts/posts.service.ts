import {postsRepository} from "./posts.repository";
import {PostType} from "./posts.types";

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
        return await postsRepository.createPost(body);
    },
    async updatePost(id: string, body: PostType) {
        return postsRepository.updatePost(id, body);
    },
    async deletePost(id: string) {
        return await postsRepository.deletePost(id);
    }
}