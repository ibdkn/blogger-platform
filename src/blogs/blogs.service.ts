import {blogsRepository} from "./blogs.repository";
import {postsRepository} from "../posts/posts.repository";
import {BlogType, BlogViewModelType} from "./blogs.types";
import {PostType} from "../posts/posts.types";
import {ObjectId, WithId} from "mongodb";
import {PaginatedResult} from "../common/types/pagination.types";


export const blogsService = {
    async getBlogs(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        searchNameTerm: string | null
    ): Promise<PaginatedResult<BlogViewModelType>> {
        // Fetch paginated and sorted blogs from the repository
        const blogs: WithId<BlogType>[] = await blogsRepository.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm);
        // Get the total count of blogs matching the filter
        const blogsCount: number = await blogsRepository.getBlogsCount(searchNameTerm);

        if (!blogs) {
            return {
                pagesCount: 0,
                page: pageNumber,
                pageSize,
                totalCount: 0,
                items: []
            }
        }

        const transformedBlogs: BlogViewModelType[] = blogs.map(blog => ({
            id: blog._id.toString(), // Convert ObjectId to string
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        }));

        // Return paginated result including page info and blog items
        return {
            pagesCount: Math.ceil(blogsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: blogsCount,
            items: transformedBlogs
        }
    },
    async getBlog(blogId: string) {
        // Fetch a single blog by its ID from the repository
        const blog = await blogsRepository.getBlog(blogId);

        // Throw an error if the blog is not found
        if (!blog) {
            throw {
                status: 404,
                errorsMessages: [{ message: 'Blog not found' }]
            };
        }

        return blog;
    },
    async createBlog(body: Omit<BlogType, 'createdAt' | 'isMembership'>): Promise<BlogViewModelType> {
        // Prepare the blog object for insertion
        const newBlog = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const result = await blogsRepository.createBlog(newBlog);

        if (result.acknowledged) {
            // Return the result in the desired format
            return {
                id: result.insertedId.toString(), // Convert ObjectId to string
                name: newBlog.name,
                description: newBlog.description,
                websiteUrl: newBlog.websiteUrl,
                createdAt: newBlog.createdAt,
                isMembership: newBlog.isMembership
            };
        } else {
            throw {
                status: 500,
                errorsMessages: [{ message: 'Failed to create a blog' }]
            };
        }
    },
    async updateBlog(id: string, body: Omit<BlogType, 'createdAt' | 'isMembership'>) {
        // Fetch a single blog by its ID from the repository
        const blog = await blogsRepository.getBlog(id);

        // Throw an error if the blog is not found
        if (!blog) {
            throw {
                status: 404,
                errorsMessages: [{ message: 'Blog not found' }]
            };
        }

        // Prepare the fields to update in the blog
        const updatedFields = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }

        const result = await blogsRepository.updateBlog(id, updatedFields);

        // Throw an error if no documents were matched
        if (result.matchedCount === 0) {
            throw {
                status: 500,
                errorsMessages: [{ message: 'Failed to update the blog' }]
            };
        }
    },
    async deleteBlog(id: string) {
        // Fetch a single blog by its ID from the repository
        const blog = await blogsRepository.getBlog(id);

        // Throw an error if the blog is not found
        if (!blog) {
            throw {
                status: 404,
                errorsMessages: [{ message: 'Blog not found' }]
            };
        }

        const result = await blogsRepository.deleteBlog(id);

        // Throw an error if the blog was not deleted
        if (result.deletedCount === 0) {
            throw {
                status: 500,
                errorsMessages: [{ message: 'Failed to delete the blog' }]
            };
        }
    }
};