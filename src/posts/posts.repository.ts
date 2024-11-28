import {PostType, PostViewModelType, PostViewModelTypeWithoutCreatedAt} from "./posts.types";
import {blogsCollection, postsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {ValidationError} from "../common/types/error.types";
import {blogsRepository} from "../blogs/blogs.repository";

export const postsRepository = {
    async getPosts(pageNumber: number, pageSize: number, sortBy: any, sortDirection: 'asc' | 'desc') {
        return postsCollection
            .find({})
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()
    },
    async getPostsCount() {
        return postsCollection.countDocuments({});
    },
    async getPost(id: string): Promise<PostViewModelType | ValidationError[] | null> {
        const post = await postsCollection
            .findOne({_id: new ObjectId(id)});

        if (post) {
            // Преобразуем _id в id и возвращаем нужный формат
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            };
        } else {
            return null;
        }
    },
    async createPost(body: Omit<PostType, 'blogName' | 'isMembership'>) {
        const blog = await blogsRepository.getBlog(body.blogId);

        // Если пост не найден, возвращаем массив ошибок
        if (!blog) return [{field: 'id', message: 'Blog not found'}];

        const post = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        }

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
    async updatePost(id: string, body: PostType): Promise<ValidationError[] | void> {
        const post = await this.getPost(id);

        // Если пост не найден, возвращаем массив ошибок
        if (!post) return [{field: 'id', message: 'Post not found'}];

        const blog = await blogsRepository.getBlog(body.blogId);

        // Если блог не найден, возвращаем массив ошибок
        if (!blog) return [{field: 'id', message: 'Blog not found'}];

        // Обновляем свойства поста
        const result = await postsCollection
            .updateOne(
                {_id: new ObjectId(id)}, // Условие поиска
                {
                    $set: {
                        title: body.title,
                        shortDescription: body.shortDescription,
                        content: body.content,
                        blogId: body.blogId
                    }
                })

        // Если ничего не обновлено, возвращаем ошибку
        if (result.matchedCount === 0) {
            return [{field: 'id', message: 'Post do not updated'}];
        }
    },
    async deletePost(id: string): Promise<ValidationError[] | void> {
        const post = await this.getPost(id);

        // Если пост не найден, возвращаем массив ошибок
        if (!post) return [{field: 'id', message: 'Post not found'}];

        // Если пост найден, то удаляем его из бд
        const result = await postsCollection
            .deleteOne({_id: new ObjectId(id)})

        if (result.deletedCount === 0) {
            return [{field: 'id', message: 'Post was not deleted'}];
        }
    }
}