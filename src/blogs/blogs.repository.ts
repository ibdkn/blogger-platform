import {BlogType, BlogViewModelType} from './blogs.types';
import {blogsCollection, postsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {ValidationError} from "../common/types/error.types";
import {PostType} from "../posts/posts.types";

export const blogsRepository = {
    async getBlogs(pageNumber: number, pageSize: number, sortBy: any, sortDirection: 'asc' | 'desc', searchNameTerm: string | null) {
        const filter: any = {};

        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'}
        }

        const blogs = await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        if (blogs) {
            return blogs.map(blog => ({
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership,
            }));
        } else {
            return null;
        }
    },
    async getBlogsCount(searchNameTerm: string | null) {
        const filter: any = {};

        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'}
        }

        return await blogsCollection.countDocuments(filter);
    },
    async getBlog(id: string): Promise<BlogViewModelType | null> {
        // Преобразуем строку id в ObjectId
        const blog = await blogsCollection
            .findOne({_id: new ObjectId(id)});

        if (blog) {
            // Преобразуем _id в id и возвращаем нужный формат
            return {
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership,
            };
        } else {
            return null;
        }
    },
    async createBlog(body: Omit<BlogType, 'createdAt' | 'isMembership'>): Promise<BlogViewModelType> {
        const blog = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };

        const result = await blogsCollection
            .insertOne(blog);

        // Проверяем, что вставка прошла успешно, и формируем объект результата
        if (result.acknowledged) {
            return {
                id: result.insertedId.toString(), // Преобразуем _id в строку
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership
            };
        } else {
            throw new Error('Failed to create a blog');
        }
    },
    async createPostForSpecificBlog(post: PostType) {
        const result = await postsCollection
            .insertOne(post);

        // Проверяем, что вставка прошла успешно, и формируем объект результата
        if (result.acknowledged) {
            return {
                id: result.insertedId.toString(), // Преобразуем _id в строку
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            };
        } else {
            throw new Error('Failed to create a blog');
        }
    },
    async updateBlog(id: string, body: BlogType): Promise<ValidationError[] | void> {
        const blog = await this.getBlog(id);

        // Если блог не найден, возвращаем массив ошибок
        if (!blog) return [{field: 'id', message: 'Blog not found'}];

        // Обновляем свойства блога
        const result = await blogsCollection
            .updateOne(
                {_id: new ObjectId(id)}, // Условие поиска
                {
                    $set: {
                        name: body.name,
                        description: body.description,
                        websiteUrl: body.websiteUrl,
                    }
                })

        // Если ничего не обновлено, возвращаем ошибку
        if (result.matchedCount === 0) {
            return [{field: 'id', message: 'Blog not found'}];
        }
    },
    async deleteBlog(id: string): Promise<ValidationError[] | void> {
        const blog = await this.getBlog(id);

        // Если блог не найден, возвращаем массив ошибок
        if (!blog) return [{field: 'id', message: 'Blog not found'}];

        // Если блог найден, то удаляем его из бд
        const result = await blogsCollection
            .deleteOne({_id: new ObjectId(id)})

        if (result.deletedCount === 0) {
            return [{ field: 'id', message: 'Blog was not deleted' }];
        }
    }
}