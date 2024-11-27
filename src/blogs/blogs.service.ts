import {blogsRepository} from "./blogs.repository";
import {postsRepository} from "../posts/posts.repository";


export const blogsService = {
    async getBlogs(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        searchNameTerm: string | null
    ) {
        const blogs = await blogsRepository.getBlogs(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm
        );
        const blogsCount = await blogsRepository.getBlogsCount(searchNameTerm);

        return {
            pageCount: Math.ceil(blogsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: blogsCount,
            items: blogs
        }
    },
};