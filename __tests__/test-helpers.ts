import {app} from '../src/app';
import {agent} from 'supertest';
import {blogsCollection, postsCollection} from "../src/db/db";

export const req = agent(app);


// Основная функция для создания тестовых данных
export const setupTestData = async (): Promise<{ blogId: string; blogName: string; postId: string }> => {
    const blog = await createTestBlog();
    const postId = await createTestPost(blog.id, blog.name);
    return {
        blogId: blog.id,
        blogName: blog.name,
        postId
    };
};

// Функция для создания тестового блога
export const createTestBlog = async (): Promise<{ id: string; name: string }> => {
    const blog = {
        name: 'Test Blog',
        description: 'Test Description',
        websiteUrl: 'https://testblog.com',
        createdAt: new Date().toISOString(),
        isMembership: false,
    };

    const result = await blogsCollection.insertOne(blog);

    return {
        id: result.insertedId.toString(),
        name: blog.name,
    };
};

// Функция для создания тестового поста
export const createTestPost = async (blogId: string, blogName: string): Promise<string> => {
    const post = {
        title: 'Post 1',
        shortDescription: 'This is a short description for Post 1',
        content: 'Detailed content for Post 1',
        blogId,
        blogName,
        createdAt: new Date().toISOString(),
    };

    const result = await postsCollection.insertOne(post);
    return result.insertedId.toString();
};