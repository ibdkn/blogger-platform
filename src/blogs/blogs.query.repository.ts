import {ObjectId, WithId} from "mongodb";
import {BlogType, BlogViewModelType} from "./blogs.types";
import {blogsCollection} from "../db/db";
import {PaginationType} from "../common/types/pagination.types";
import {ResultStatus} from "../common/result/resultCode";
import {AppError} from "../common/types/error.types";

export const blogsQueryRepository = {
    async findAll(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        searchNameTerm: string | null
    ): Promise<PaginationType<BlogViewModelType>> {
        const filter: any = {};

        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'}
        }

        const blogs: WithId<BlogType>[] = await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 } as any)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        if (!blogs) {
            return {
                pagesCount: 0,
                page: pageNumber,
                pageSize,
                totalCount: 0,
                items: []
            }
        }

        const blogsCount: number = await blogsCollection.countDocuments(filter);
        const transformedBlogs: BlogViewModelType[] = blogs.map(blog => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        }));

        return {
            pagesCount: Math.ceil(blogsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: blogsCount,
            items: transformedBlogs
        }
    },
    async findById(id: string): Promise<BlogViewModelType> {
        const blog: WithId<BlogType> | null = await blogsCollection
            .findOne({_id: new ObjectId(id)});

        if (!blog) {
            throw new AppError(
                ResultStatus.NotFound,
                'Not found',
                [{message: 'Blog not found'}],
                null
            );
        }

        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
    },
}