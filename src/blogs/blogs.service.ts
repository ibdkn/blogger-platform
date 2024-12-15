import {blogsRepository} from "./blogs.repository";
import {BlogType} from "./blogs.types";
import {DeleteResult, UpdateResult, WithId} from "mongodb";
import {AppError} from "../common/types/error.types";
import {ResultStatus} from "../common/result/resultCode";

export const blogsService = {
    async create(body: Omit<BlogType, 'createdAt' | 'isMembership'>): Promise<string> {
        const newBlog = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        return await blogsRepository.create(newBlog);
    },
    async updateBlog(id: string, body: Omit<BlogType, 'createdAt' | 'isMembership'>) {
        const blog: WithId<BlogType> | null = await blogsRepository.findById(id);

        if (!blog) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Blog not found'}],
                null
            );
        }

        const updatedFields = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }

        const result: UpdateResult = await blogsRepository.update(id, updatedFields);

        if (result.matchedCount === 0) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Failed to update the blog'}],
                null
            );
        }
    },
    async deleteBlog(id: string): Promise<void> {
        const blog: WithId<BlogType> | null = await blogsRepository.findById(id);

        if (!blog) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Blog not found'}],
                null
            );
        }

        const result: DeleteResult = await blogsRepository.delete(id);

        if (result.deletedCount === 0) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Blog was not deleted'}],
                null
            );
        }
    }
};