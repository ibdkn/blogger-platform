import {postsRepository} from "./posts.repository";

export const postsService = {
    async getPostsByBlogId(
        blogId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc'
    ) {
        const posts = await postsRepository.getPostsByBlogId(
            blogId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        );
        const postsCount = await postsRepository.getPostsCountByBlogId(blogId);

        return {
            pageCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: posts
        };
    },
}