import {postsRepository} from "./posts.repository";
import {PostType} from "./posts.types";

export const postsService = {
    async getPosts(pageNumber: number, pagesSize: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        const posts = await postsRepository.getPosts(
            pageNumber,
            pagesSize,
            sortBy,
            sortDirection
        );
        const postsCount = await postsRepository.getPostsCount();

        return {
            pageCount: Math.ceil(postsCount / pagesSize),
            page: pageNumber,
            pagesSize,
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