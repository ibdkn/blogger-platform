import {blogsRepository} from "./blogs.repository";
import {BlogEntityModelType, BlogType, BlogViewModelType} from "./blogs.types";

export const blogsService = {
    async createBlog(body: Omit<BlogType, 'createdAt' | 'isMembership'>): Promise<BlogViewModelType> {
        const newBlog = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const result = await blogsRepository.createBlog(newBlog);

        if (result.acknowledged) {
            return {
                id: result.insertedId.toString(),
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
        const blog: BlogEntityModelType | null = await blogsRepository.getBlog(id);

        if (!blog) {
            throw {
                status: 404,
                errorsMessages: [{ message: 'Blog not found' }]
            };
        }

        const updatedFields = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }

        const result = await blogsRepository.updateBlog(id, updatedFields);

        if (result.matchedCount === 0) {
            throw {
                status: 500,
                errorsMessages: [{ message: 'Failed to update the blog' }]
            };
        }
    },
    async deleteBlog(id: string) {
        const blog: BlogEntityModelType | null = await blogsRepository.getBlog(id);

        if (!blog) {
            throw {
                status: 404,
                errorsMessages: [{ message: 'Blog not found' }]
            };
        }

        const result = await blogsRepository.deleteBlog(id);

        if (result.deletedCount === 0) {
            throw {
                status: 500,
                errorsMessages: [{ message: 'Failed to delete the blog' }]
            };
        }
    }
};