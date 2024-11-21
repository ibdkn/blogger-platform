import {BlogType, BlogViewModelType} from './blogs.types';
import {blogsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {ValidationError} from "../common/types/error.types";

export const blogsRepository = {
    async getAllBlogs(): Promise<BlogViewModelType[]> {
        const blogs = await blogsCollection
            .find({})
            .toArray();

        // Преобразуем каждый документ
        return blogs.map((blog) => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        }));
    },
    async getBlog(id: string): Promise<BlogViewModelType | ValidationError[] | null> {
        if (!ObjectId.isValid(id)) return [{field: 'id', message: 'Invalid ObjectId'}];

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
            isMembership: true
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
    async updateBlog(id: string, body: BlogType): Promise<ValidationError[] | void> {
        if (!ObjectId.isValid(id)) return [{field: 'id', message: 'Invalid ObjectId'}];

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
                        isMembership: body.isMembership
                    }
                })

        // Если ничего не обновлено, возвращаем ошибку
        if (result.matchedCount === 0) {
            return [{field: 'id', message: 'Blog not found'}];
        }
    },
    async deleteBlog(id: string): Promise<ValidationError[] | void> {
        if (!ObjectId.isValid(id)) return [{field: 'id', message: 'Invalid ObjectId'}];

        const blog = await this.getBlog(id);

        // Если блог не найден, возвращаем массив ошибок
        if (!blog) return [{field: 'id', message: 'Blog not found'}];

        // Если блог найден, то удаляем его из бд
        const result = await blogsCollection
            .deleteOne({_id: new ObjectId(id)})

        if (result.deletedCount === 0) {
            return [{ field: 'id', message: 'Blog not found' }];
        }
    }
}